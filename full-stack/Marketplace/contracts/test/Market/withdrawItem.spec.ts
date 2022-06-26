import { expect } from "chai";
import { BigNumber, ethers, constants } from "ethers";
import { parseEther } from "ethers/lib/utils";
import {
  faucetTestERC721,
  approveERC721,
  ERC721FaucetTokenIDs,
} from "../shared/utils";
import { MarketErrors, BaseErrors } from "../shared/errors";

export function withdrawItem() {
  let nftIds: ERC721FaucetTokenIDs;
  let listingTokenId: BigNumber;
  let listingPrice: BigNumber;

  beforeEach("List NFTs", async function () {
    const { market, nft } = this.contracts;
    const { alice } = this.namedSigners;

    nftIds = await faucetTestERC721(nft, [alice], 2);

    await approveERC721(nft, [alice], [nftIds.get(alice)!], market.address);

    listingTokenId = nftIds.get(alice)![0];
    listingPrice = parseEther("1");

    // List the first minted NFT only
    await market
      .connect(alice)
      .listItem(nft.address, listingTokenId, listingPrice);
  });

  it("should clear the entire listing", async function () {
    const { market, nft } = this.contracts;
    const { alice, bob } = this.namedSigners;

    await market.connect(alice).withdrawItem(nft.address, listingTokenId);

    const listing = await market.getListing(nft.address, listingTokenId);

    expect(listing.owner).to.eq(constants.AddressZero);
    expect(listing.price).to.eq(0);
  });

  it("should emit a WithdrawnItem event correctly", async function () {
    const { market, nft } = this.contracts;
    const { alice } = this.namedSigners;

    const tx = market.connect(alice).withdrawItem(nft.address, listingTokenId);

    await expect(tx)
      .to.emit(
        market,
        market.interface.events["WithdrawnItem(address,uint256)"].name
      )
      .withArgs(nft.address, listingTokenId);
  });

  context("Failure", async function () {
    it("should fail when the nft is not listed", async function () {
      const { market, nft } = this.contracts;
      const { alice } = this.namedSigners;

      const listingTokenId = nftIds.get(alice)![1];

      await expect(
        market.connect(alice).withdrawItem(nft.address, listingTokenId)
      ).to.be.revertedWith(MarketErrors.NotListed);
    });

    it("should fail if the nft contract is the zero address", async function () {
      const { market } = this.contracts;
      const { alice } = this.namedSigners;

      const tx = market
        .connect(alice)
        .withdrawItem(constants.AddressZero, listingTokenId);

      await expect(tx).to.be.revertedWith(BaseErrors.ZeroAddress);
    });
    it("should fail if the caller is not the owner of the nft", async function () {
      const { market, nft } = this.contracts;
      const { bob } = this.namedSigners;

      const tx = market.connect(bob).withdrawItem(nft.address, listingTokenId);

      await expect(tx).to.be.revertedWith(MarketErrors.NotOwner);
    });
  });
}
