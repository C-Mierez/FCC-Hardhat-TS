# Hardhat Typescript Template

A quick template made for personal use to ease the headache of setting up config parameters when starting a new project.

It is particularly tuned to my preferences and project structure, but feel free to use it as well 😄

> I intend to keep updating as I learn more and identify recurring project features.

## Features

Some of the main features and plugins being used are:

- [Hardhat](https://github.com/nomiclabs/hardhat): Ethereum Development Environment.
- [TypeChain](https://github.com/ethereum-ts/TypeChain): TypeScript types generator for smart contracts.
- [Ethers](https://github.com/ethers-io/ethers.js/): Ethereum library implementation.
- [Waffle](https://github.com/EthWorks/Waffle): Tooling for writing comprehensive smart contract tests.
- [Solhint](https://github.com/protofire/solhint): Linter.
- [Prettier (Solidity)](https://github.com/prettier-solidity/prettier-plugin-solidity): Code formatter.
- [Hardhat-Deploy](https://github.com/wighawag/hardhat-deploy): Hardhat plugin for better deployment management.

Additionally, I have also added some commonly used smart contract dependencies:

- [@openzeppelin/contracts](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts)
- [@chainlink/contracts](https://github.com/smartcontractkit/chainlink/tree/develop/contracts)

And finally, I also make use of some scripts and config in the `Utils` folder. Some of the hardhat files use these scripts to improve readability/maintainability.

<br/>

# Setup

Install all dependencies:

```sh
$ yarn install
```

Compile the smart contracts with Hardhat:

```sh
$ yarn hardhat compile
```

> Don't forget to set up the `.env` file.

### Test

Run the Mocha tests:

```sh
$ yarn test
```

### Deploy contract to network

```sh
$ yarn hardhat deploy --network rinkeby
```

# Cheers 😄
