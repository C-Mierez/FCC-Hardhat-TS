import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { isCurrentChainLocal } from "../utils/scripts/isCurrentChainLocal";

const deployMocks: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const { isLocal, chainId } = isCurrentChainLocal();

  if (isLocal) {
    log("Local Network - Deploying Mocks...");
    await deploy("TestToken", {
      from: deployer,
      args: ["TestToken", "TT"],
      log: true,
    });

    log(`Mocks Deployed to Local Network ${chainId}.`);
  } else {
    log(
      `Network ${chainId} is not a Local Network - Skipping Mocks Deployment.`
    );
  }
};

export default deployMocks;

deployMocks.tags = ["all", "mocks"];
