import assert from "assert";
import { run } from "hardhat";

const verify = async (contractAddress: string, args: any[]) => {
  console.log("Verifying contract...");

  try {
    assert(process.env.ETHERSCAN_API_KEY);
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error: any) {
    console.log(error);
  }
};

export default verify;
