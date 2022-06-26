import { expect } from "chai";
import { BigNumber, constants } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { BaseErrors, MarketErrors } from "../shared/errors";
import {
  approveERC721,
  ERC721FaucetTokenIDs,
  faucetTestERC721,
} from "../shared/utils";

export function listItem() {
  let nftIds: ERC721FaucetTokenIDs;
  let listingPrice: BigNumber;

  beforeEach("Mint an NFT", async function () {
    const { nft, market } = this.contracts;
    const { alice } = this.namedSigners;

    nftIds = await faucetTestERC721(nft, [alice], 2);

    await approveERC721(nft, [alice], [nftIds.get(alice)!], market.address);

    listingPrice = parseEther("1");
  });

  it("should create a correct listing struct", async function () {
    const { market, nft } = this.contracts;
    const { alice } = this.namedSigners;

    await market
      .connect(alice)
      .listItem(nft.address, nftIds.get(alice)![0], listingPrice);

    const listing = await market.getListing(nft.address, nftIds.get(alice)![0]);

    expect(listing.owner).to.eq(alice.address);
    expect(listing.price).to.eq(listingPrice);
  });

  it("should emit a correct ListedItem event", async function () {
    const { market, nft } = this.contracts;
    const { alice } = this.namedSigners;

    const tx = market
      .connect(alice)
      .listItem(nft.address, nftIds.get(alice)![0], listingPrice);

    await expect(tx)
      .to.emit(
        market,
        market.interface.events["ListedItem(address,address,uint256,uint256)"]
          .name
      )
      .withArgs(
        alice.address,
        nft.address,
        nftIds.get(alice)![0],
        listingPrice
      );
  });

  describe("Failure", async () => {
    it("should fail if the nft address is zero", async function () {
      const { market, nft } = this.contracts;
      const { alice } = this.namedSigners;

      const tx = market
        .connect(alice)
        .listItem(constants.AddressZero, nftIds.get(alice)![0], listingPrice);

      await expect(tx).to.be.revertedWith(BaseErrors.ZeroAddress);
    });
    it("should fail if the price is zero", async function () {
      const { market, nft } = this.contracts;
      const { alice } = this.namedSigners;

      const tx = market
        .connect(alice)
        .listItem(nft.address, nftIds.get(alice)![0], 0);

      await expect(tx).to.be.revertedWith(BaseErrors.ZeroValue);
    });
    it("should fail if the caller is not the owner of the nft", async function () {
      const { market, nft } = this.contracts;
      const { alice, bob } = this.namedSigners;

      // Bob mints and approves an NFT
      const receipt = await (await nft.connect(bob).faucet()).wait();
      let tokenId = constants.MaxUint256;
      receipt.events!.forEach((event) => {
        if (event.event === "Transfer") {
          tokenId = event.args!.tokenId;
        }
      });
      await nft.connect(bob).approve(market.address, tokenId);

      // Alice tries to list Bob's NFT
      const tx = market
        .connect(alice)
        .listItem(nft.address, tokenId, listingPrice);

      await expect(tx).to.be.revertedWith(MarketErrors.NotOwner);
    });
    it("should fail if the caller has not approved spending", async function () {
      const { market, nft } = this.contracts;
      const { alice } = this.namedSigners;

      // Remove approvals
      await nft
        .connect(alice)
        .approve(constants.AddressZero, nftIds.get(alice)![0]);

      const tx = market
        .connect(alice)
        .listItem(nft.address, nftIds.get(alice)![0], listingPrice);

      await expect(tx).to.be.revertedWith(MarketErrors.NotApproved);
    });
    it("should fail if the token is already listed", async function () {
      const { market, nft } = this.contracts;
      const { alice } = this.namedSigners;

      // List
      await market
        .connect(alice)
        .listItem(nft.address, nftIds.get(alice)![0], listingPrice);

      // List again
      const tx = market
        .connect(alice)
        .listItem(nft.address, nftIds.get(alice)![0], listingPrice);

      await expect(tx).to.be.revertedWith(MarketErrors.AlreadyListed);
    });
  });
}
