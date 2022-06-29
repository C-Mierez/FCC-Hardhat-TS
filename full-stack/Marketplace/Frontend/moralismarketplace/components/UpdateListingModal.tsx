import { ethers } from "ethers"
import { ChangeEvent, MouseEvent, useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { Input, Modal } from "web3uikit"
import { Market__factory } from "../typechain-types/factories/contracts/Market__factory"

interface Params {
    nftAddress: string
    tokenId: string
    marketAddress: string
    isVisible: boolean
    onClose: Function
}

export default function UpdateListingModal({
    nftAddress,
    tokenId,
    marketAddress,
    isVisible,
    onClose,
}: Params) {
    const [newPriceToUpdate, setNewPriceToUpdate] = useState("0")

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: Market__factory.abi,
        contractAddress: marketAddress,
        functionName: "updateItem",
        params: {
            _nft: nftAddress,
            _tokenId: tokenId,
            _newPrice: ethers.utils.parseEther(newPriceToUpdate),
        },
    })

    const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        setNewPriceToUpdate(e.target.value)
    }

    return (
        <Modal
            isVisible={isVisible}
            onOk={(e) => {
                updateListing({
                    onError: (e) => {
                        console.log(e)
                    },
                })
            }}
            onCancel={() => {
                onClose()
            }}
            onCloseButtonPressed={() => {
                onClose()
            }}
        >
            <Input
                label="Update listing price (ETH)"
                name="New listing price"
                type="number"
                onChange={onChangeInput}
            ></Input>
        </Modal>
    )
}
