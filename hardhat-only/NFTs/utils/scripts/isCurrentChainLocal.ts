import { network } from "hardhat";
import { networks } from "../utils-hardhat-config";

export function isCurrentChainLocal() {
  const chainId = network.config.chainId as number;

  const isLocal = networks[chainId].config.isLocalChain;

  return { isLocal, chainId };
}
