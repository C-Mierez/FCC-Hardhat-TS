import { ethers } from "ethers"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { Card } from "web3uikit"
import { TestNFT__factory } from "../typechain-types/factories/contracts/test/TestNFT__factory"
import styles from "../styles/NFTCard.module.css"
import truncateEthAddress from "truncate-eth-address"
import UpdateListingModal from "./UpdateListingModal"

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

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: TestNFT__factory.abi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            _tokenId: tokenId,
        },
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

    const onCardClick = () => {
        if (isOwnedByUser) {
            setShowUpdateModal(true)
        }
    }

    return (
        <div style={{ overflow: "hidden" }}>
            {imageURI ? (
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
                    </div>
                </>
            ) : (
                <>Loading NFT URI...</>
            )}
        </div>
    )
}
