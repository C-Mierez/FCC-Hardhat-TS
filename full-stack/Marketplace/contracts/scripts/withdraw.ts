import { ethers } from "hardhat";
import { listItem } from "../test/Market/listItem.spec";
import { Market } from "../typechain-types/contracts/Market";
import { TestNFT } from "../typechain-types/contracts/test/TestNFT";
import { parseEther } from "ethers/lib/utils";
import { isCurrentChainLocal } from "../utils/scripts/isCurrentChainLocal";
import { moveBlocks } from "../utils/scripts/moveBlocks";

const TOKEN_ID = 0;

async function main() {
  const { chainId } = isCurrentChainLocal();
  const market = (await ethers.getContract("Market")) as Market;
  const nft = (await ethers.getContract("TestNFT")) as TestNFT;

  console.log(`Withdrawing tokenId ${TOKEN_ID}...`);
  await (await market.withdrawItem(nft.address, TOKEN_ID)).wait();

  console.log("Withdrawn!");

  if (chainId == 31337) {
    // Moralis has a hard time if you move more than 1 at once!
    await moveBlocks(1, 1000);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
