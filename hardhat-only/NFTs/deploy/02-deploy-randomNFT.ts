import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { metadataTemplate } from "../utils/meta/metadataTemplate";
import { isCurrentChainLocal } from "../utils/scripts/isCurrentChainLocal";
import {
  storeImages,
  storeTokenURIMetadata,
} from "../utils/scripts/uploadToPinata";
import verify from "../utils/scripts/verify";
import {
  networks,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} from "../utils/utils-hardhat-config";

const IMAGES_LOCATION = "./assets/RandomNFT/";
const TOKEN_URIS = [
  "ipfs://QmVrzhJonqauUuDnerPeqSHSiv7fk5pecvS9jsbh5KLgQV",
  "ipfs://QmY4kxEiYhvH9u49pW8joLrs4wr8xNzXfrxySBddnSLcDE",
  "ipfs://Qme3WdzbhE1SUgbGzZFXM7HYNHiRgc2xb6AasdJF1Vxm7s",
];

const deployRandomNFT: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  let tokenURIs;
  // Get IPFS hashes of the images to be used
  if (TOKEN_URIS.length == 0 && process.env.UPLOAD_TO_IPFS == "true") {
    tokenURIs = await getIPFSHashes();
  } else {
    tokenURIs = TOKEN_URIS;
  }

  const { isLocal, chainId } = isCurrentChainLocal();

  // Grab the Mocks if in development chain
  let vrfCoordinatorAddress, subscriptionId;
  if (isLocal) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    vrfCoordinatorAddress = vrfCoordinatorV2Mock.address;
    const tx = await vrfCoordinatorV2Mock.createSubscription();
    const txReceipt = await tx.wait();
    subscriptionId = txReceipt.events[0].args.subId;
  } else {
    // I only have this set up for Mumbai network
    vrfCoordinatorAddress = networks[chainId].contracts.other?.VRFCoordinatorV2;
    subscriptionId = networks[chainId].config.subscriptionId;
  }
  let gasLane = networks[chainId].config.gasLane;
  let callbackGasLimit = networks[chainId].config.callbackGasLimit;
  let mintFee = parseEther("0.01");
  const args: any[] = [
    "RandomNFT",
    "RNFT",
    vrfCoordinatorAddress,
    subscriptionId,
    gasLane,
    callbackGasLimit,
    tokenURIs,
    mintFee,
  ];

  const randomNFT = await deploy("RandomNFT", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: isLocal ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS,
  });

  if (!isLocal) {
    await verify(randomNFT.address, args);
  }
};

export default deployRandomNFT;

deployRandomNFT.tags = ["all", "randomNFT"];

async function getIPFSHashes() {
  const tokenURIs = [];

  const { responses, files } = await storeImages(IMAGES_LOCATION);

  for (const imageIndex in responses) {
    let tokenURIMetadata = { ...metadataTemplate };
    tokenURIMetadata.name = files[imageIndex].replace(".png", "");
    tokenURIMetadata.description = `An adorable ${tokenURIMetadata.name}.`;
    tokenURIMetadata.image = `ipfs://${responses[imageIndex].IpfsHash}`;

    console.log(`Uploading ${tokenURIMetadata.name}...`);
    const metadataResponse = await storeTokenURIMetadata(tokenURIMetadata);
    tokenURIs.push(`ipfs://${metadataResponse!.IpfsHash}`);
  }
  console.log("Token URIs uploaded.");
  console.log(tokenURIs);
  return tokenURIs;
}
