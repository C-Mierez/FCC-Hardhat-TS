import { expect } from "chai";
import { BigNumber, constants } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { getTxUsedETH } from "../../utils/scripts/getTxUsedETH";
import { BaseErrors, MarketErrors } from "../shared/errors";
import {
  approveERC721,
  ERC721FaucetTokenIDs,
  faucetTestERC721,
} from "../shared/utils";
export function buyItem() {
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

  it("should spend the exact expected price", async function () {
    const { market, nft } = this.contracts;
    const { alice, bob } = this.namedSigners;

    const iniBalance = await bob.getBalance(); // ETH

    const tx = await market
      .connect(bob)
      .buyItem(nft.address, listingTokenId, { value: listingPrice });

    const gasUsed = await getTxUsedETH(tx);

    expect(await bob.getBalance()).to.be.eq(
      iniBalance.sub(listingPrice).sub(gasUsed)
    );
  });

  it("should transfer the purchased nft to the buyer", async function () {
    const { market, nft } = this.contracts;
    const { alice, bob } = this.namedSigners;

    expect(await nft.ownerOf(listingTokenId)).to.not.be.eq(bob.address);

    await market
      .connect(bob)
      .buyItem(nft.address, listingTokenId, { value: listingPrice });

    expect(await nft.ownerOf(listingTokenId)).to.be.eq(bob.address);
  });

  it("should take account of the corresponding value owed to the seller", async function () {
    const { market, nft } = this.contracts;
    const { alice, bob } = this.namedSigners;

    const iniOwed = await market.getOwedProceeds(alice.address);

    await market
      .connect(bob)
      .buyItem(nft.address, listingTokenId, { value: listingPrice });

    expect(await market.getOwedProceeds(alice.address)).to.be.eq(
      iniOwed.add(listingPrice)
    );
  });

  it("should accumulate proceeds from multiple successful sales", async function () {
    const { market, nft } = this.contracts;
    const { alice, bob } = this.namedSigners;

    const secondTokenId = nftIds.get(alice)![1];

    // Make a second listing of the second minted NFT
    await market
      .connect(alice)
      .listItem(nft.address, secondTokenId, listingPrice);

    const iniOwed = await market.getOwedProceeds(alice.address);

    // Purchase both listed NFTs
    await market
      .connect(bob)
      .buyItem(nft.address, listingTokenId, { value: listingPrice });

    await market
      .connect(bob)
      .buyItem(nft.address, secondTokenId, { value: listingPrice });

    expect(await market.getOwedProceeds(alice.address)).to.be.eq(
      iniOwed.add(listingPrice.mul(2))
    );
  });

  it("should emit a BoughtItem event correctly", async function () {
    const { market, nft } = this.contracts;
    const { alice, bob } = this.namedSigners;

    const tx = market
      .connect(bob)
      .buyItem(nft.address, listingTokenId, { value: listingPrice });

    await expect(tx)
      .to.emit(
        market,
        market.interface.events[
          "BoughtItem(address,address,address,uint256,uint256)"
        ].name
      )
      .withArgs(
        bob.address,
        alice.address,
        nft.address,
        listingTokenId,
        listingPrice
      );
  });

  context("Failure", async function () {
    it("should fail when the nft is not listed", async function () {
      const { market, nft } = this.contracts;
      const { alice, bob } = this.namedSigners;

      const listingTokenId = nftIds.get(alice)![1];

      await expect(
        market
          .connect(bob)
          .buyItem(nft.address, listingTokenId, { value: listingPrice })
      ).to.be.revertedWith(MarketErrors.NotListed);
    });

    it("should fail if the nft contract is the zero address", async function () {
      const { market } = this.contracts;
      const { bob } = this.namedSigners;

      const tx = market
        .connect(bob)
        .buyItem(constants.AddressZero, listingTokenId, {
          value: listingPrice,
        });

      await expect(tx).to.be.revertedWith(BaseErrors.ZeroAddress);
    });
    it("should fail if the amount payed is not correct", async function () {
      const { market, nft } = this.contracts;
      const { alice, bob } = this.namedSigners;

      let tx = market
        .connect(bob)
        .buyItem(nft.address, listingTokenId, { value: listingPrice.add(1) });

      await expect(tx).to.be.revertedWith(MarketErrors.InvalidAmountPayed);

      tx = market
        .connect(bob)
        .buyItem(nft.address, listingTokenId, { value: listingPrice.sub(1) });

      await expect(tx).to.be.revertedWith(MarketErrors.InvalidAmountPayed);
    });
  });
}
