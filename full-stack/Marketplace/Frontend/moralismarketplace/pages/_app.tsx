import "../styles/globals.css"
import type { AppProps } from "next/app"
import { MoralisProvider } from "react-moralis"
import Header from "../components/Header"
import Head from "next/head"
import styles from "../styles/Layout.module.css"
import { NotificationProvider } from "web3uikit"

const MORALIS_ID = process.env.NEXT_PUBLIC_MORALIS_ID || ""
const MORALIS_URL = process.env.NEXT_PUBLIC_MORALIS_URL || ""

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="NFT Marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider appId={MORALIS_ID} serverUrl={MORALIS_URL}>
                <NotificationProvider>
                    <Header />
                    <div className={styles.main}>
                        <Component {...pageProps} />
                    </div>
                </NotificationProvider>
            </MoralisProvider>
        </>
    )
}

export default MyApp
