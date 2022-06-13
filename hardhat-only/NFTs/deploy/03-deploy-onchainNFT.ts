import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { isCurrentChainLocal } from "../utils/scripts/isCurrentChainLocal";
import verify from "../utils/scripts/verify";
import fs from "fs";
import {
  networks,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} from "../utils/utils-hardhat-config";

const SVG_LOCATION = "./assets/OnChainNFT/";

const deployOnChainNFT: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const { isLocal, chainId } = isCurrentChainLocal();

  // Grab the Mocks if in development chain
  let ethUsdPriceFeedAddress;
  if (isLocal) {
    const ethUsdPriceFeed = await ethers.getContract("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdPriceFeed.address;
  } else {
    // I only have this set up for Mumbai network
    ethUsdPriceFeedAddress = networks[chainId].contracts.priceFeeds!["eth_usd"];
  }

  // Get SVGs
  const lowSVG = await fs.readFileSync(SVG_LOCATION + "frown.svg", {
    encoding: "utf-8",
  });
  const highSVG = await fs.readFileSync(SVG_LOCATION + "happy.svg", {
    encoding: "utf-8",
  });

  const args: any[] = [
    "OnChainNFT",
    "OCNFT",
    lowSVG,
    highSVG,
    ethUsdPriceFeedAddress,
  ];

  const onchainNFT = await deploy("OnChainNFT", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: isLocal ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS,
  });

  if (!isLocal) {
    await verify(onchainNFT.address, args);
  }
};

export default deployOnChainNFT;

deployOnChainNFT.tags = ["all", "onchainNFT"];
