import type { NextPage } from "next"
import Head from "next/head"
import { useMoralisQuery, useMoralis } from "react-moralis"
import NFTCard from "../components/NFTCard"
import styles from "../styles/Home.module.css"

const Home: NextPage = () => {
    const { data: listedNFTs, isFetching: isFetchingListed } = useMoralisQuery(
        "ActiveItem",
        (query) => query.limit(10).descending("tokenId")
    )

    return (
        <div className={styles.home}>
            <h2>Recently Listed NFTs</h2>
            <div>
                {isFetchingListed ? (
                    <div>Loading...</div>
                ) : listedNFTs.length === 0 ? (
                    <div className={styles.empty_grid}>No NFTs have been listed yet!</div>
                ) : (
                    <div className={styles.card_grid}>
                        {listedNFTs.map((nft) => {
                            const { price, nftAddress, tokenId, marketAddress, owner } =
                                nft.attributes
                            return (
                                <NFTCard
                                    price={price}
                                    marketAddress={marketAddress}
                                    nftAddress={nftAddress}
                                    owner={owner}
                                    tokenId={tokenId}
                                    key={`${nftAddress}${tokenId}`}
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
