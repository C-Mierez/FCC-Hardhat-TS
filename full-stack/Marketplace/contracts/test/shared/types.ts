import { Wallet } from "@ethersproject/wallet";
import { Market } from "../../typechain-types/contracts/Market";
import { TestNFT } from "../../typechain-types/contracts/test/TestNFT";

declare module "mocha" {
  export interface Context {
    // loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    contracts: Contracts;
    namedSigners: Signers;
    unnamedSigners: Wallet[];
  }
}

export interface Signers {
  // Semantic Users
  deployer: Wallet;

  // Other Users
  alice: Wallet;
  bob: Wallet;
  charlie: Wallet;
  dave: Wallet;
}

// Expand this interface with all the contracts needed
export interface Contracts {
  market: Market;
  nft: TestNFT;
}
