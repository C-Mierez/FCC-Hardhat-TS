import { expect } from "chai";
import { BigNumber, ethers, constants } from "ethers";
import { parseEther } from "ethers/lib/utils";
import {
  faucetTestERC721,
  approveERC721,
  ERC721FaucetTokenIDs,
} from "../shared/utils";
import { MarketErrors, BaseErrors } from "../shared/errors";
import { getTxUsedETH } from "../../utils/scripts/getTxUsedETH";

export function claimProceeds() {
  let nftIds: ERC721FaucetTokenIDs;
  let listingTokenId: BigNumber;
  let listingTokenId2: BigNumber;
  let listingPrice: BigNumber;
  let expectedProceeds: BigNumber;

  beforeEach("List NFTs", async function () {
    const { market, nft } = this.contracts;
    const { alice } = this.namedSigners;

    nftIds = await faucetTestERC721(nft, [alice], 2);

    await approveERC721(nft, [alice], [nftIds.get(alice)!], market.address);

    listingTokenId = nftIds.get(alice)![0];
    listingTokenId2 = nftIds.get(alice)![1];
    listingPrice = parseEther("1");

    // List both NFTs
    await market
      .connect(alice)
      .listItem(nft.address, listingTokenId, listingPrice);

    await market
      .connect(alice)
      .listItem(nft.address, listingTokenId2, listingPrice);
  });

  beforeEach("Buy all NFTs", async function () {
    const { market, nft } = this.contracts;
    const { bob } = this.namedSigners;

    await market
      .connect(bob)
      .buyItem(nft.address, listingTokenId, { value: listingPrice });
    await market
      .connect(bob)
      .buyItem(nft.address, listingTokenId2, { value: listingPrice });

    expectedProceeds = listingPrice.mul(2);
  });

  it("should transfer all the owed proceeds", async function () {
    const { market } = this.contracts;
    const { alice } = this.namedSigners;

    const iniBalance = await alice.getBalance();

    const tx = await market.connect(alice).claimProceeds();

    const gasUsed = await getTxUsedETH(tx);

    expect(await alice.getBalance()).to.eq(
      iniBalance.add(expectedProceeds).sub(gasUsed)
    );
  });

  it("should clear the pending proceeds balance", async function () {
    const { market } = this.contracts;
    const { alice } = this.namedSigners;

    await market.connect(alice).claimProceeds();

    await expect(await market.getOwedProceeds(alice.address)).to.eq(0);
  });

  it("should emit a ClaimedProceeds event correctly", async function () {
    const { market } = this.contracts;
    const { alice } = this.namedSigners;

    const tx = market.connect(alice).claimProceeds();

    await expect(tx)
      .to.emit(
        market,
        market.interface.events["ClaimedProceeds(address,uint256)"].name
      )
      .withArgs(alice.address, expectedProceeds);
  });

  context("Failure", async function () {
    it("should fail when the are no proceeds to claim", async function () {
      const { market, nft } = this.contracts;
      const { alice } = this.namedSigners;

      await market.connect(alice).claimProceeds();

      expect(await market.getOwedProceeds(alice.address)).to.eq(0);

      const tx = market.connect(alice).claimProceeds();

      await expect(tx).to.be.revertedWith(MarketErrors.NoProceedsToClaim);
    });
  });
}
