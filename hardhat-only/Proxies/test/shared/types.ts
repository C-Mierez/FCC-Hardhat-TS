import { Wallet } from "@ethersproject/wallet";
import { TestToken, UselessBank } from "../../typechain-types";

declare module "mocha" {
  export interface Context {
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
export interface Contracts {}
