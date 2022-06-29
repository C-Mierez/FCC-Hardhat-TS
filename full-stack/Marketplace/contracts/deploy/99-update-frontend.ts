import { ethers } from "hardhat";
import { isCurrentChainLocal } from "../utils/scripts/isCurrentChainLocal";
import fs from "fs";
import { DeployFunction } from "hardhat-deploy/types";

const frontEndContractsFile = "../contracts/constants/networkMapping.json";
const frontEndABIFileLocation = "../contracts/constants/";

const updateFrontend: DeployFunction = async function (hre) {
  if (process.env.UPDATE_FRONTEND) {
    console.log("Updating frontend...");
    await updateContractAddresses();
    await updateABIs();
  }
};

async function updateABIs() {
  const market = await ethers.getContract("Market");

  fs.writeFileSync(
    `${frontEndABIFileLocation}Market.json`,
    market.interface.format(ethers.utils.FormatTypes.json).toString()
  );

  const nft = await ethers.getContract("TestNFT");

  fs.writeFileSync(
    `${frontEndABIFileLocation}TestNFT.json`,
    nft.interface.format(ethers.utils.FormatTypes.json).toString()
  );
}

async function updateContractAddresses() {
  const market = await ethers.getContract("Market");
  const { chainId } = isCurrentChainLocal();

  const contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractsFile, "utf8")
  );

  if (chainId in contractAddresses) {
    if (!contractAddresses[chainId]["Market"].includes(market.address)) {
      contractAddresses[chainId]["Market"].push(market.address);
    }
  } else {
    contractAddresses[chainId] = { Market: [market.address] };
  }
  fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses));
}

export default updateFrontend;

updateFrontend.tags = ["all", "frontend"];
