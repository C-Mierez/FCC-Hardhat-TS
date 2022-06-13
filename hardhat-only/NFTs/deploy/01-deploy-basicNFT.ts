import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { isCurrentChainLocal } from "../utils/scripts/isCurrentChainLocal";
import verify from "../utils/scripts/verify";
import {
  networks,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} from "../utils/utils-hardhat-config";

const deployBasicNFT: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const { isLocal, chainId } = isCurrentChainLocal();

  const args: any[] = ["BasicNFT", "BNFT"];

  const basicNFT = await deploy("BasicNFT", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: isLocal ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS,
  });

  if (!isLocal) {
    await verify(basicNFT.address, args);
  }
};

export default deployBasicNFT;

deployBasicNFT.tags = ["all", "BasicNFT"];
