import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { isCurrentChainLocal } from "../utils/scripts/isCurrentChainLocal";
import verify from "../utils/scripts/verify";
import { VERIFICATION_BLOCK_CONFIRMATIONS } from "../utils/utils-hardhat-config";

const deployBoxV2: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const { isLocal, chainId } = isCurrentChainLocal();

  const args: any[] = [];

  const boxV2 = await deploy("BoxV2", {
    from: deployer,
    args: args,
    proxy: {},
    log: true,
    waitConfirmations: isLocal ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS,
  });

  if (!isLocal) {
    await verify(boxV2.address, args);
  }
};

export default deployBoxV2;

deployBoxV2.tags = ["all", "BoxV2"];
