// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/interfaces/IERC721.sol";

interface IMarket {
    struct Listing {
        address owner;
        uint256 price;
    }

    /* --------------------------------- Errors --------------------------------- */
    error NotApproved(address nft, uint256 tokenId);

    error NotListed(address nft, uint256 tokenId);

    error AlreadyListed(address nft, uint256 tokenId);

    error NotOwner(address nft, uint256 tokenId);

    error InvalidAmountPayed(uint256 price);

    error NoProceedsToClaim();

    error NotEnoughContractBalance();

    /* --------------------------------- Events --------------------------------- */

    event ListedItem(
        address indexed owner,
        IERC721 indexed nft,
        uint256 indexed tokenId,
        uint256 price
    );

    event BoughtItem(
        address indexed buyer,
        address seller,
        IERC721 indexed nft,
        uint256 indexed tokenId,
        uint256 price
    );

    event WithdrawnItem(IERC721 indexed nft, uint256 indexed tokenId);

    event UpdatedItem(
        address indexed owner,
        IERC721 indexed nft,
        uint256 indexed tokenId,
        uint256 newPrice
    );

    event ClaimedProceeds(address indexed owner, uint256 indexed amount);

    /* -------------------------------- Functions ------------------------------- */

    /// @notice Lists an item on the marketplace.
    /// @dev The submitted NFT is approved for the contract to transfer it when the listing is confirmed.
    /// @param nft Address of the NFT contract.
    /// @param tokenId NFT token ID.
    /// @param price Price of the item.
    function listItem(
        IERC721 nft,
        uint256 tokenId,
        uint256 price
    ) external;

    /// @notice Buys a listed item on the marketplace.
    /// @dev The buyer is charged the price of the item.
    /// @param nft Address of the NFT contract.
    /// @param tokenId NFT token ID.
    function buyItem(IERC721 nft, uint256 tokenId) external payable;

    /// @notice Cancels a listing on the marketplace.
    /// @param nft Address of the NFT contract.
    /// @param tokenId NFT token ID.
    function withdrawItem(IERC721 nft, uint256 tokenId) external;

    //7 @notice Updates the price of a listing on the marketplace.
    /// @param nft Address of the NFT contract.
    /// @param tokenId NFT token ID.
    /// @param newPrice New price of the item.
    function updateItem(
        IERC721 nft,
        uint256 tokenId,
        uint256 newPrice
    ) external;

    function claimProceeds() external;

    /* ---------------------------------- View ---------------------------------- */
    function getListing(IERC721 _nft, uint256 _tokenId)
        external
        view
        returns (Listing memory);

    function getOwedProceeds(address seller) external view returns (uint256);
}
