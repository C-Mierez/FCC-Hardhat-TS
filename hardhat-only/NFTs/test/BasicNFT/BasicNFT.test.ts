import { expect } from "chai";

export function testBasicNFT() {
  describe("BasicNFT", async () => {
    describe("#constructor", async () => {
      it("should deploy with a counter at 0", async function () {
        expect(await this.contracts.basicNFT.getTokenCounter()).to.be.eq(0);
      });
    });

    describe("#mint", async () => {
      it("should mint the requested tokens successfully", async function () {
        const { basicNFT } = this.contracts;
        const { alice } = this.namedSigners;
        const initialSupply = await basicNFT.getTokenCounter();

        await basicNFT.connect(alice).mint();

        expect(await basicNFT.getTokenCounter()).to.be.eq(initialSupply.add(1));

        expect(await basicNFT.balanceOf(alice.address)).to.eq(1);
      });
      it("should set the correct id to the minted token", async function () {
        const { basicNFT } = this.contracts;
        const { alice, bob } = this.namedSigners;
        await basicNFT.connect(alice).mint();
        await basicNFT.connect(bob).mint();

        expect(await basicNFT.ownerOf(0)).to.be.eq(alice.address);
        expect(await basicNFT.ownerOf(1)).to.be.eq(bob.address);
      });
    });

    describe("#tokenURI", async () => {
      it("should return the expected token URI", async function () {
        const { basicNFT } = this.contracts;
        expect(await basicNFT.tokenURI(0)).to.eq(await basicNFT.TOKEN_URI());
      });
    });
  });
}
