import { gql, useQuery } from "@apollo/client"
import type { NextPage } from "next"
import Head from "next/head"
import { useMoralis } from "react-moralis"
import NFTCard from "../components/NFTCard"
import styles from "../styles/Home.module.css"
import contractAddresses from "../constants/networkMapping.json"

const GET_ACTIVE_ITEMS = gql`
    {
        activeItems(first: 5, where: { buyer: "0x0000000000000000000000000000000000000000" }) {
            id
            buyer
            owner
            nft
            tokenId
            price
        }
    }
`

const Home: NextPage = () => {
    const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS)
    const { chainId } = useMoralis()
    const parsedChainId = chainId
        ? (parseInt(chainId).toString() as keyof typeof contractAddresses)
        : "31337"
    const marketAddress = contractAddresses[parsedChainId]["Market"][0]

    const activeItems = data?.activeItems

    console.log(data)

    return (
        <div className={styles.home}>
            <h2>Recently Listed NFTs</h2>
            <div>
                {loading ? (
                    <div>Loading...</div>
                ) : !activeItems ? (
                    <div className={styles.empty_grid}>No NFTs have been listed yet!</div>
                ) : (
                    <div className={styles.card_grid}>
                        {activeItems.map((item: any) => {
                            const { price, nft, tokenId, owner } = item
                            return (
                                <NFTCard
                                    price={price}
                                    marketAddress={marketAddress}
                                    nftAddress={nft}
                                    owner={owner}
                                    tokenId={tokenId}
                                    key={`${nft}${tokenId}`}
                                ></NFTCard>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home
