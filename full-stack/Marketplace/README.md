# NFT Marketplace

### TO-DO:

- Create the NFT Marketplace
  - [x] `listItem`: List NFTs on the marketplace.
  - [x] `buyItem`: Buy an NFT.
  - [x] `withdrawItem`: Cancel a listing.
  - [x] `updateItem`: Update the listing, like the price.
  - [x] `claimProceeds`: Withdraw the payment for successful item sells.

### Considerations

- In order to avoid taking custody of the NFT, and thus taking the right from the owner to prove their ownership temporarily while the NFT is being listed, an "Approval"-based approach is done instead. The owner allows the Marketplace to perform a transfer when the listing is successfully paid for.
