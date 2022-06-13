import { expect } from "chai";
import { parseEther } from "ethers/lib/utils";

export function testRandomNFT() {
  describe("RandomNFT", async () => {
    describe("#constructor", async () => {
      it("should deploy with a counter at 0", async function () {
        expect(await this.contracts.randomNFT.getTokenCounter()).to.be.eq(0);
      });
      it("should ", async function () {});
    });

    describe("#mint", async () => {
      it("should request the mint successfully", async function () {
        const { randomNFT } = this.contracts;
        const { alice } = this.namedSigners;

        const price = await randomNFT.getMintPrice();
        const tx = randomNFT.connect(alice).requestMint({ value: price });

        await expect(tx).to.emit(
          randomNFT,
          randomNFT.interface.events["NFTMintRequested(address,uint256)"].name
        );
      });
      it("should revert if payment is not correct", async function () {
        const { randomNFT } = this.contracts;
        const { alice } = this.namedSigners;

        const price = await randomNFT.getMintPrice();
        const tx = randomNFT
          .connect(alice)
          .requestMint({ value: price.add(1) });

        await expect(tx).to.be.reverted;
      });
    });

    describe("#fulfillRandomWords", function () {
      it("should mint the NFT after random number is returned", async function () {
        const { randomNFT } = this.contracts;
        const { alice } = this.namedSigners;

        await new Promise<void>(async (resolve, reject) => {
          randomNFT.once(
            randomNFT.interface.events["NFTMinted(address,uint256,uint256)"]
              .name,
            async () => {
              try {
                const tokenURI = await randomNFT.tokenURI(0);
                const tokenCounter = await randomNFT.getTokenCounter();
                expect(tokenURI.toString()).to.include("ipfs://");
                expect(tokenCounter.toString()).to.eq("1");
                resolve();
              } catch (e) {
                console.log(e);
                reject(e);
              }
            }
          );
          try {
            const price = await randomNFT.getMintPrice();
            const tx = await randomNFT.requestMint({
              value: price,
            });
            const requestMintReceipt = await tx.wait(1);
            await this.mocks.vrfCoordinator.fulfillRandomWords(
              requestMintReceipt.events![1].args!.requestId,
              randomNFT.address
            );
          } catch (e) {
            console.log(e);
            reject(e);
          }
        });
      });
    });
  });
}
