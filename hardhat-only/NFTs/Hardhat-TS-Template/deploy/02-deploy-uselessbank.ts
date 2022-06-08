import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { isCurrentChainLocal } from "../utils/scripts/isCurrentChainLocal";
import verify from "../utils/scripts/verify";
import {
  networks,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} from "../utils/utils-hardhat-config";

const deployUselessBank: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const { isLocal, chainId } = isCurrentChainLocal();

  // Get the depended contracts
  let tokenAddress;
  if (isLocal) {
    const mockToken = await deployments.get("TestToken");
    tokenAddress = mockToken.address;
  } else {
    tokenAddress = networks[chainId].contracts.tokens.token;

    tokenAddress = tokenAddress
      ? tokenAddress
      : (await deployments.get("Token")).address;
  }

  const args: any[] = [tokenAddress];

  const bank = await deploy("UselessBank", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: isLocal ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS,
  });

  if (!isLocal) {
    await verify(bank.address, args);
  }
};

export default deployUselessBank;

deployUselessBank.tags = ["all", "UselessBank"];
deployUselessBank.dependencies = ["Token"];
