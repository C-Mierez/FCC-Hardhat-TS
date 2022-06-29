# TheGraph Frotend

This is the second option that are gonna be used for the Marketplace's frontend.

In this case, TheGraph will be used for listening to emitted events from the contracts, and act / update accordingly. 

> This is the more "decentralized" approach of the two.

### Features
 
- Home Page: 
  - Show recently listed NFTs
    - If the user owns the NFT, you can update the listing.
    - Otherwise, you can buy the listing.

- Sell Page:
  - NFTs can be listed on the Marketplace. 

### Differences

Instead of what was done with Moralis, this will:
- Index the events with TheGraph
- Read them from TheGraph