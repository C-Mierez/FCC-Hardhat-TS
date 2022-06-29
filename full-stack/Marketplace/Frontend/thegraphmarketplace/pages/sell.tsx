import Head from "next/head"
import { Form, useNotification } from "web3uikit"
import { FormDataReturned } from "web3uikit/dist/components/Form/types"
import styles from "../styles/Sell.module.css"
import { ethers } from "ethers"
import { TestNFT__factory } from "../typechain-types/factories/contracts/test/TestNFT__factory"
import { useMoralis, useWeb3Contract, Web3ExecuteFunctionParameters } from "react-moralis"
import contractAddresses from "../constants/networkMapping.json"
import { Market__factory } from "../typechain-types"

export default function SellPage() {
    const { chainId } = useMoralis()
    const parsedChainId = chainId
        ? (parseInt(chainId).toString() as keyof typeof contractAddresses)
        : "31337"
    const marketAddress = contractAddresses[parsedChainId]["Market"][0]
    const dispatch = useNotification()

    const { runContractFunction } = useWeb3Contract({})

    const approveAndList = async (data: FormDataReturned) => {
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils
            .parseUnits(data.data[2].inputResult.toString(), "ether")
            .toString()

        dispatch({ type: "info", position: "topL", message: "Approving..." })
        const approveOptions: Web3ExecuteFunctionParameters = {
            abi: TestNFT__factory.abi,
            contractAddress: nftAddress.toString(),
            functionName: "approve",
            params: {
                to: marketAddress,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: approveOptions,
            onSuccess: () => {
                handleApproveSuccess(nftAddress.toString(), tokenId.toString(), price)
            },
            onError: (e) => {
                console.log(e)
            },
        })
    }

    const handleApproveSuccess = async (nftAddress: string, tokenId: string, price: string) => {
        dispatch({ type: "info", position: "topL", message: "Listing..." })
        const listOptions: Web3ExecuteFunctionParameters = {
            abi: Market__factory.abi,
            contractAddress: marketAddress,
            functionName: "listItem",
            params: {
                _nft: nftAddress,
                _tokenId: tokenId,
                _price: price,
            },
        }

        await runContractFunction({
            params: listOptions,
            onSuccess: () => {
                handleListSuccess()
            },
            onError: (e) => {
                console.log(e)
            },
        })
    }

    const handleListSuccess = async () => {
        dispatch({
            type: "success",
            position: "topL",
            message: "Listing successful. Please refresh.",
        })
    }

    return (
        <div className={styles.container}>
            <Form
                id="sellForm"
                onSubmit={approveAndList}
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        value: "",
                        inputWidth: "50%",
                        key: "nftAddress",
                    },
                    {
                        name: "Token ID",
                        type: "number",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Price",
                        type: "number",
                        value: "",
                        key: "price",
                    },
                ]}
                title="Sell your NFT!"
            ></Form>
        </div>
    )
}
