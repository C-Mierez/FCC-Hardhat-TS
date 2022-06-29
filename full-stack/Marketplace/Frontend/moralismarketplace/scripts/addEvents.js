const Moralis = require("moralis/node")
require("dotenv").config()
const networkMapping = require("../constants/networkMapping.json")

const chainId = process.env.CHAIN_ID || "31337"

const contractAddress = networkMapping[chainId]["Market"][0]
const serverURL = process.env.NEXT_PUBLIC_MORALIS_URL
const appId = process.env.NEXT_PUBLIC_MORALIS_ID
const masterKey = process.env.NEXT_PUBLIC_MORALIS_KEY

async function main() {
    await Moralis.start({ serverUrl: serverURL, appId: appId, masterKey: masterKey })
    console.log(`Adding Event listening for contract ${contractAddress}`)

    // For Moralis, local chainId is 1337
    let mChainId = chainId === "31337" ? "1337" : chainId

    const listedItemOptions = {
        chainId: mChainId,
        sync_historical: true,
        address: contractAddress,
        tableName: "ListedItem",
        topic: "ListedItem(address,address,uint256,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "owner",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "contract IERC721",
                    name: "nft",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ListedItem",
            type: "event",
        },
    }

    const boughtItemOptions = {
        chainId: mChainId,
        sync_historical: true,
        address: contractAddress,
        tableName: "BoughtItem",
        topic: "BoughtItem(address,address,address,uint256,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "buyer",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "contract IERC721",
                    name: "nft",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "BoughtItem",
            type: "event",
        },
    }

    const withdrawnItemOptions = {
        chainId: mChainId,
        sync_historical: true,
        address: contractAddress,
        tableName: "WithdrawnItem",
        topic: "WithdrawnItem(address,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "contract IERC721",
                    name: "nft",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "WithdrawnItem",
            type: "event",
        },
    }

    const updatedItemOptions = {
        chainId: mChainId,
        sync_historical: true,
        address: contractAddress,
        tableName: "UpdatedItem",
        topic: "UpdatedItem(address,address,uint256,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "owner",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "contract IERC721",
                    name: "nft",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "newPrice",
                    type: "uint256",
                },
            ],
            name: "UpdatedItem",
            type: "event",
        },
    }

    const listedResponse = await Moralis.Cloud.run("watchContractEvent", listedItemOptions, {
        useMasterKey: true,
    })

    const boughtResponse = await Moralis.Cloud.run("watchContractEvent", boughtItemOptions, {
        useMasterKey: true,
    })

    const withdrawnResponse = await Moralis.Cloud.run("watchContractEvent", withdrawnItemOptions, {
        useMasterKey: true,
    })

    const updatedResponse = await Moralis.Cloud.run("watchContractEvent", updatedItemOptions, {
        useMasterKey: true,
    })

    if (
        listedResponse.success &&
        boughtResponse.success &&
        withdrawnResponse.success &&
        updatedResponse.success
    ) {
        console.log("Database updated successfully for listening events.")
    } else {
        console.log("ERROR Updating database for listening events.")
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
