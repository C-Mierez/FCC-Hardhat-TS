import { Address, BigInt } from "@graphprotocol/graph-ts";

export function getItemId(nft: Address, tokenId: BigInt): string {
    return nft.toHexString() + tokenId.toHexString();
}
