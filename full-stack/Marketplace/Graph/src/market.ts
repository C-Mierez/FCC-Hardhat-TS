import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
    Market,
    BoughtItem,
    ClaimedProceeds,
    ListedItem,
    UpdatedItem,
    WithdrawnItem,
} from "../generated/Market/Market";
import { getItemId } from "./utils";
import * as sc from "../generated/schema";

export function handleBoughtItem(event: BoughtItem): void {
    const id = getItemId(event.params.nft, event.params.tokenId);

    let boughtItem = sc.BoughtItem.load(id);

    let activeItem = sc.ActiveItem.load(id);

    if (!boughtItem) {
        boughtItem = new sc.BoughtItem(id);
    }

    boughtItem.buyer = event.params.buyer;
    boughtItem.nft = event.params.nft;
    boughtItem.tokenId = event.params.tokenId;
    boughtItem.price = event.params.price;

    activeItem!.buyer = event.params.buyer;

    boughtItem.save();
    activeItem!.save();
}

export function handleClaimedProceeds(event: ClaimedProceeds): void {
    const id = event.params.owner.toHexString();

    let claimedProceeds = sc.ClaimedProceeds.load(id);

    if (!claimedProceeds) {
        claimedProceeds = new sc.ClaimedProceeds(id);
    }

    claimedProceeds.amount = claimedProceeds.amount.plus(event.params.amount);

    claimedProceeds.save();
}

export function handleListedItem(event: ListedItem): void {
    const id = getItemId(event.params.nft, event.params.tokenId);

    let listedItem = sc.ListedItem.load(id);

    let activeItem = sc.ActiveItem.load(id);

    if (!listedItem) {
        listedItem = new sc.ListedItem(id);
    }

    if (!activeItem) {
        activeItem = new sc.ActiveItem(id);
    }

    listedItem.owner = event.params.owner;
    listedItem.nft = event.params.nft;
    listedItem.tokenId = event.params.tokenId;
    listedItem.price = event.params.price;

    activeItem.owner = event.params.owner;
    activeItem.nft = event.params.nft;
    activeItem.tokenId = event.params.tokenId;
    activeItem.price = event.params.price;
    activeItem.buyer = Address.zero();

    listedItem.save();
    activeItem.save();
}

export function handleUpdatedItem(event: UpdatedItem): void {
    const id = getItemId(event.params.nft, event.params.tokenId);

    let updatedItem = sc.UpdatedItem.load(id);

    let activeItem = sc.ActiveItem.load(id);

    if (!updatedItem) {
        updatedItem = new sc.UpdatedItem(id);
    }

    updatedItem.owner = event.params.owner;
    updatedItem.nft = event.params.nft;
    updatedItem.tokenId = event.params.tokenId;
    updatedItem.price = event.params.newPrice;

    activeItem!.price = event.params.newPrice;

    updatedItem.save();
    activeItem!.save();
}

export function handleWithdrawnItem(event: WithdrawnItem): void {
    const id = getItemId(event.params.nft, event.params.tokenId);

    let withdrawnItem = sc.WithdrawnItem.load(id);

    let activeItem = sc.ActiveItem.load(id);

    if (!withdrawnItem) {
        withdrawnItem = new sc.WithdrawnItem(id);
    }

    withdrawnItem.owner = activeItem!.owner;
    withdrawnItem.nft = event.params.nft;
    withdrawnItem.tokenId = event.params.tokenId;

    // Denoting the item as withdrawn
    activeItem!.buyer = Address.fromString(
        "0x000000000000000000000000000000000000dEaD"
    );

    withdrawnItem.save();
    activeItem!.save();
}
