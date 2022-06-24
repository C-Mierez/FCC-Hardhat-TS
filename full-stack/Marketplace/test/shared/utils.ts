import { BigNumber, Contract, Wallet } from "ethers";
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

export type ERC721FaucetTokenIDs = Map<Wallet, BigNumber[]>;

export const faucetTestERC721 = async (
  erc721: Contract,
  signers: Wallet[],
  amountToMint?: number
) => {
  amountToMint = amountToMint ? amountToMint : 1;
  const mintedTokens: ERC721FaucetTokenIDs = new Map();

  for (const signer of signers) {
    let tokenIds = [];
    for (let i = 0; i < amountToMint; i++) {
      const receipt = await (await erc721.connect(signer).faucet()).wait();
      for (const event of receipt.events!) {
        if (event.event === "MintedTestToken") {
          tokenIds.push(event.args.tokenId);
        }
      }
    }
    mintedTokens.set(signer, tokenIds);
  }

  return mintedTokens;
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

export const approveERC721 = async (
  erc721: Contract,
  signers: Wallet[],
  tokenIds: BigNumber[][],
  spenderAddress: string
) => {
  if (signers.length != tokenIds.length)
    throw new Error("signers and tokenIds must be the same length");

  for (let i = 0; i < signers.length; i++) {
    for (let j = 0; j < tokenIds[i].length; j++) {
      await erc721.connect(signers[i]).approve(spenderAddress, tokenIds[i][j]);
    }
  }
};
