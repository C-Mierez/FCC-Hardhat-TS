# Moralis Frotend

This is one of the two options that are gonna be used for the Marketplace's frontend.

In this case, Moralis will be used for listening to emitted events from the contracts, and act / update accordingly. 

> This is the more "centralized" approach of the two.

### Features
 
- Home Page: 
  - Show recently listed NFTs
    - If the user owns the NFT, you can update the listing.
    - Otherwise, you can buy the listing.

- Sell Page:
  - NFTs can be listed on the Marketplace. 

### Objective

Listen to events off-chain and read from this new database. A server will be set up to listen for these events to be fired and add them to a database.