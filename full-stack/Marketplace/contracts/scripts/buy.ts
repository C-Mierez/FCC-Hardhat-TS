import { ethers } from "hardhat";
import { listItem } from "../test/Market/listItem.spec";
import { Market } from "../typechain-types/contracts/Market";
import { TestNFT } from "../typechain-types/contracts/test/TestNFT";
import { parseEther, parseUnits } from "ethers/lib/utils";
import { isCurrentChainLocal } from "../utils/scripts/isCurrentChainLocal";
import { moveBlocks } from "../utils/scripts/moveBlocks";
import { BigNumber } from "ethers";

const TOKEN_ID = 3;

async function main() {
  const { chainId } = isCurrentChainLocal();
  const market = (await ethers.getContract("Market")) as Market;
  const nft = (await ethers.getContract("TestNFT")) as TestNFT;

  const price = await (await market.getListing(nft.address, TOKEN_ID)).price;
  console.log(
    `Buying tokenId ${TOKEN_ID} for ${parseUnits(price.toString(), "ether")}...`
  );

  await (
    await market.buyItem(nft.address, TOKEN_ID, {
      value: price,
    })
  ).wait();

  console.log("Bought!");

  if (chainId == 31337) {
    // Moralis has a hard time if you move more than 1 at once!
    await moveBlocks(1, 1000);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
