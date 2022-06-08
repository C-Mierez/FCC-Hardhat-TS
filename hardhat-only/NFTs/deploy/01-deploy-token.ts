import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { isCurrentChainLocal } from "../utils/scripts/isCurrentChainLocal";
import verify from "../utils/scripts/verify";
import { VERIFICATION_BLOCK_CONFIRMATIONS } from "../utils/utils-hardhat-config";

const deployToken: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const { isLocal, chainId } = isCurrentChainLocal();

  let toDeploy: string;
  const args: any[] = [];
  if (isLocal) {
    toDeploy = "TestToken";
    args.push("TestToken", "TT");
  } else {
    toDeploy = "Token";
    args.push("Token", "T");
  }

  const token = await deploy("Token", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: isLocal ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS,
  });

  if (!isLocal) {
    await verify(token.address, args);
  }
};

export default deployToken;

deployToken.tags = ["all", "Token"];
