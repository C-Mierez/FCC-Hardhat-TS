import { ethers } from "ethers";
export async function getTxUsedETH(tx: ethers.ContractTransaction) {
  const receipt = await tx.wait();

  return receipt.effectiveGasPrice.mul(receipt.cumulativeGasUsed);
}
