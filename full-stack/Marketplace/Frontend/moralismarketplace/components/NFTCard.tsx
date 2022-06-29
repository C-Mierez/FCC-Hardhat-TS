import { ethers } from "ethers"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { Card, useNotification } from "web3uikit"
import { TestNFT__factory } from "../typechain-types/factories/contracts/test/TestNFT__factory"
import styles from "../styles/NFTCard.module.css"
import truncateEthAddress from "truncate-eth-address"
import UpdateListingModal from "./UpdateListingModal"
import { Market__factory } from "../typechain-types/factories/contracts/Market__factory"

interface Params {
    price: number
    nftAddress: string
    tokenId: string
    marketAddress: string
    owner: string
}
export default function NFTCard({ price, nftAddress, marketAddress, owner, tokenId }: Params) {
    const [imageURI, setImageURI] = useState("")
    const { isWeb3Enabled, account } = useMoralis()
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const dispatch = useNotification()

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: TestNFT__factory.abi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            _tokenId: tokenId,
        },
    })

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: Market__factory.abi,
        contractAddress: marketAddress,
        functionName: "buyItem",
        params: {
            _nft: nftAddress,
            _tokenId: tokenId,
        },
        msgValue: price,
    })

    async function updateUI() {
        const tokenURI = (await getTokenURI()) as string
        console.log(tokenURI)

        if (tokenURI) {
            // IPFS Gateway
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()

            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")

            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const isOwnedByUser = account === owner || owner === undefined

    const formattedOwnerAddress = isOwnedByUser ? "you!" : truncateEthAddress(owner)

    const handleBuyItemSuccess = async (tx: any) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            position: "topR",
            title: "Item bought!",
            message: "You have successfully bought this item.",
        })
    }

    const onCardClick = () => {
        if (isOwnedByUser) {
            setShowUpdateModal(true)
        } else {
            buyItem({
                onError: (e) => {
                    console.log(e)
                },
                onSuccess: handleBuyItemSuccess,
            })
        }
    }

    return (
        <div style={{ overflow: "hidden" }}>
            <>
                <UpdateListingModal
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    marketAddress={marketAddress}
                    isVisible={showUpdateModal}
                    onClose={() => {
                        setShowUpdateModal(false)
                    }}
                />
                <div className={styles.card} onClick={onCardClick}>
                    <div className={styles.card_details}>
                        <div>Owned by {formattedOwnerAddress}</div>
                        <div>#{tokenId}</div>
                    </div>
                    {imageURI ? (
                        <>
                            <div className={styles.card_image}>
                                <Image
                                    loader={() => imageURI}
                                    src={imageURI}
                                    height="200"
                                    width="200"
                                />
                                <div>{ethers.utils.formatUnits(price, "ether")} ETH</div>
                            </div>
                            <div className={styles.card_description}>
                                <div>{tokenName}</div>
                                <div>{tokenDescription}</div>
                            </div>
                        </>
                    ) : (
                        <div className={styles.placeholder}>Fetching...</div>
                    )}
                </div>
            </>
        </div>
    )
}
