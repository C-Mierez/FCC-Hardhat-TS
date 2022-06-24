import { expect } from "chai";
import { BigNumber, ethers, constants } from "ethers";
import { parseEther } from "ethers/lib/utils";
import {
  faucetTestERC721,
  approveERC721,
  ERC721FaucetTokenIDs,
} from "../shared/utils";
import { MarketErrors, BaseErrors } from "../shared/errors";

export function updateItem() {
  let nftIds: ERC721FaucetTokenIDs;
  let listingTokenId: BigNumber;
  let listingPrice: BigNumber;
  let newListingPrice: BigNumber;

  beforeEach("List NFTs", async function () {
    const { market, nft } = this.contracts;
    const { alice } = this.namedSigners;

    nftIds = await faucetTestERC721(nft, [alice], 2);

    await approveERC721(nft, [alice], [nftIds.get(alice)!], market.address);

    listingTokenId = nftIds.get(alice)![0];
    listingPrice = parseEther("1");
    newListingPrice = parseEther("2");

    // List the first minted NFT only
    await market
      .connect(alice)
      .listItem(nft.address, listingTokenId, listingPrice);
  });

  it("should change the listed price", async function () {
    const { market, nft } = this.contracts;
    const { alice, bob } = this.namedSigners;

    await market
      .connect(alice)
      .updateItem(nft.address, listingTokenId, newListingPrice);

    const listing = await market.getListing(nft.address, listingTokenId);

    expect(listing.price).to.be.eq(newListingPrice);
  });

  it("should emit an UpdatedItem event correctly", async function () {
    const { market, nft } = this.contracts;
    const { alice } = this.namedSigners;

    const tx = market
      .connect(alice)
      .updateItem(nft.address, listingTokenId, newListingPrice);

    await expect(tx)
      .to.emit(
        market,
        market.interface.events["UpdatedItem(address,address,uint256,uint256)"]
          .name
      )
      .withArgs(alice.address, nft.address, listingTokenId, newListingPrice);
  });

  context("Failure", async function () {
    it("should fail when the nft is not listed", async function () {
      const { market, nft } = this.contracts;
      const { alice } = this.namedSigners;

      const listingTokenId = nftIds.get(alice)![1];

      await expect(
        market
          .connect(alice)
          .updateItem(nft.address, listingTokenId, newListingPrice)
      ).to.be.revertedWith(MarketErrors.NotListed);
    });

    it("should fail if the nft contract is the zero address", async function () {
      const { market } = this.contracts;
      const { alice } = this.namedSigners;

      const tx = market
        .connect(alice)
        .updateItem(constants.AddressZero, listingTokenId, newListingPrice);

      await expect(tx).to.be.revertedWith(BaseErrors.ZeroAddress);
    });
    it("should fail if the caller is not the owner of the nft", async function () {
      const { market, nft } = this.contracts;
      const { alice, bob } = this.namedSigners;

      const tx = market
        .connect(bob)
        .updateItem(nft.address, listingTokenId, newListingPrice);

      await expect(tx).to.be.revertedWith(MarketErrors.NotOwner);
    });
  });
}
