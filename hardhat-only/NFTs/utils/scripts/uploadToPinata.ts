import pinataSDK from "@pinata/sdk";
import path from "path";
import fs from "fs";

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_PRIVATE_KEY = process.env.PINATA_PRIVATE_KEY;
const pinata = pinataSDK(
  PINATA_API_KEY as string,
  PINATA_PRIVATE_KEY as string
);

export async function storeImages(imagesFilePath: string) {
  const fullImagesPath = path.resolve(imagesFilePath);
  const files = fs.readdirSync(fullImagesPath);

  console.log(`Uploading "${fullImagesPath}" to Pinata IPFS...`);

  let responses = [];
  for (const fileIndex in files) {
    const readableStreamForFile = fs.createReadStream(
      `${fullImagesPath}/${files[fileIndex]}`
    );

    try {
      const response = await pinata.pinFileToIPFS(readableStreamForFile);
      responses.push(response);

      console.log(`Uploaded file ${fileIndex} to Pinata.`);
    } catch (error) {
      console.log(error);
    }
  }

  return { responses, files };
}

export async function storeTokenURIMetadata(metadata: Object) {
  try {
    const response = await pinata.pinJSONToIPFS(metadata);
    return response;
  } catch (error) {
    console.log(error);
  }
  return null;
}
