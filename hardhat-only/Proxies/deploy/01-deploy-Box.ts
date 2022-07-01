import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { isCurrentChainLocal } from "../utils/scripts/isCurrentChainLocal";
import verify from "../utils/scripts/verify";
import { VERIFICATION_BLOCK_CONFIRMATIONS } from "../utils/utils-hardhat-config";

const deployBox: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const { isLocal, chainId } = isCurrentChainLocal();

  const args: any[] = [];

  const box = await deploy("Box", {
    from: deployer,
    args: args,
    proxy: {
      proxyContract: "OpenZeppelinTransparentProxy",
      viaAdminContract: {
        name: "BoxProxyAdmin",
        artifact: "BoxProxyAdmin",
      },
    },
    log: true,
    waitConfirmations: isLocal ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS,
  });

  if (!isLocal) {
    await verify(box.address, args);
  }
};

export default deployBox;

deployBox.tags = ["all", "Box"];
