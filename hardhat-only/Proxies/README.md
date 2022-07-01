# Simple Proxy Contracts

A simple example of using proxies to upgrade smart contracts.


#### Objective

- Deploy a `Proxy` contract.
- Deploy a `Box` contract.
  - Point `Proxy` to `Box` implementation.
- Deploy `BoxV2` contract.
  - Point `Proxy` to `BoxV2` implementation.

#### Deployment 

Proxy deployment will can be made in multiple ways:
- Deploying the Proxy manually.
- Using Hardhat-Deploy's built-in Proxy support.
- Using Openzeppelin's Upgraded plugin.

In this case, Hardhat-Deploy is being used only.