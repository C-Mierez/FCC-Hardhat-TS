import { Wallet } from "@ethersproject/wallet";
import { BasicNFT } from "../../typechain-types/contracts/BasicNFT";
import { RandomNFT } from "../../typechain-types/contracts/RandomNFT";

declare module "mocha" {
  export interface Context {
    // loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    contracts: Contracts;
    namedSigners: Signers;
    unnamedSigners: Wallet[];
  }
}

export interface Signers {
  deployer: Wallet;
  alice: Wallet;
  bob: Wallet;
  charlie: Wallet;
  dave: Wallet;
}

//! Expand this interface with all the contracts needed
export interface Contracts {
  basicNFT: BasicNFT;
  randomNFT: RandomNFT;
}
