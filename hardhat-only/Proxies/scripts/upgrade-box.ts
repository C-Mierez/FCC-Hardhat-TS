import { ethers } from "hardhat";
import { BoxProxyAdmin } from "../typechain-types/contracts/proxy/BoxProxyAdmin";
import { BoxV2 } from "../typechain-types/contracts/BoxV2";
import { Box } from "../typechain-types/contracts/Box";

// This is the manual way of upgrading a transparent proxy
async function main() {
  const proxyAdmin = (await ethers.getContract(
    "BoxProxyAdmin"
  )) as BoxProxyAdmin;
  const transparentProxy = await ethers.getContract("Box_Proxy");
  const proxyBoxV1 = (await ethers.getContract(
    "Box",
    transparentProxy.address
  )) as Box;
  const boxV2 = await ethers.getContract("BoxV2");

  const versionV1 = await proxyBoxV1.getVersion();

  const upgradeTx = await proxyAdmin.upgrade(
    transparentProxy.address,
    boxV2.address
  );
  await upgradeTx.wait(1);

  const proxyBox2 = (await ethers.getContract(
    "BoxV2",
    transparentProxy.address
  )) as BoxV2;

  const versionV2 = await proxyBox2.getVersion();

  console.log(`Version V1 is ${versionV1}`);
  console.log(`Version V2 is ${versionV2}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
