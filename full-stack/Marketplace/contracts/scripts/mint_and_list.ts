import { ethers } from "hardhat";
import { listItem } from "../test/Market/listItem.spec";
import { Market } from "../typechain-types/contracts/Market";
import { TestNFT } from "../typechain-types/contracts/test/TestNFT";
import { parseEther } from "ethers/lib/utils";
import { isCurrentChainLocal } from "../utils/scripts/isCurrentChainLocal";
import { moveBlocks } from "../utils/scripts/moveBlocks";

async function main() {
  const { chainId } = isCurrentChainLocal();
  const market = (await ethers.getContract("Market")) as Market;
  const nft = (await ethers.getContract("TestNFT")) as TestNFT;

  console.log("Minting...");
  const receipt = await (await nft.faucet()).wait();

  const tokenId = receipt.events![0].args!.tokenId;

  console.log("Approving...");
  await (await nft.approve(market.address, tokenId)).wait();

  console.log("Listing...");
  await (await market.listItem(nft.address, tokenId, parseEther("2"))).wait();

  console.log("Listed!");

  if (chainId == 31337) {
    // Moralis has a hard time if you move more than 1 at once!
    await moveBlocks(1, 1000);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
