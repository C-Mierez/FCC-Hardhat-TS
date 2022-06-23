import { ethers } from "hardhat";
import { UselessBank } from "../typechain-types";

async function main() {
  const Bank = await ethers.getContractFactory("UselessBank");

  const bank = (await Bank.deploy()) as UselessBank;
  await bank.deployed();

  console.log("UselessBank deployed to:", bank.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
