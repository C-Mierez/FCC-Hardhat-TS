import { Contract, Wallet } from "ethers";
import { parseEther } from "ethers/lib/utils";

const DEFAULT_FUNDING = parseEther("100");

export const faucetTestERC20 = async (
  erc20: Contract,
  signers: Wallet[],
  amount?: number
) => {
  const amountToFund = amount || DEFAULT_FUNDING;

  for (const signer of signers) {
    await erc20.connect(signer).faucet(amountToFund);
  }
};

export const approveERC20 = async (
  erc20: Contract,
  signers: Wallet[],
  spenderAddress: string,
  amount?: number
) => {
  const amountToApprove = amount || DEFAULT_FUNDING;

  for (const signer of signers) {
    await erc20.connect(signer).approve(spenderAddress, amountToApprove);
  }
};
