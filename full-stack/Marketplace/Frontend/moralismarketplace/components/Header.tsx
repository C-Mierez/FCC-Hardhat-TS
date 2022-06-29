import Link from "next/link"
import { ConnectButton } from "web3uikit"
import styles from "../styles/Layout.module.css"

export default function Header() {
    return (
        <nav className={styles.header}>
            <div>
                <h1>NFT Marketplace</h1>
                <h3>👷‍♂️ Moralis</h3>
            </div>
            <div className={styles.buttons}>
                <Link href={"/"}>
                    <a>Home</a>
                </Link>
                <Link href={"/sell"}>
                    <a>Sell</a>
                </Link>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
