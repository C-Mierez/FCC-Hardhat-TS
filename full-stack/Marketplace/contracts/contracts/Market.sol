// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "./interfaces/IMarket.sol";
import "./abstract/Base.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Market is IMarket, ReentrancyGuard, Base {
    /// @dev Listing information for each nft token
    /// NFT Address -> TokenId -> Listing
    mapping(IERC721 => mapping(uint256 => Listing)) internal s_listings;

    /// @dev Store the cumulative amount of ETH owed to each seller
    /// Seller Address -> Amount of ETH owed
    mapping(address => uint256) internal s_owedProceeds;

    /* -------------------------------- Modifiers ------------------------------- */
    /// @dev Checks whether the Market is approved to transfer the NFT.
    modifier isApproved(IERC721 _nft, uint256 _tokenId) {
        if (_nft.getApproved(_tokenId) != address(this))
            revert NotApproved(address(_nft), _tokenId);
        _;
    }

    modifier isListed(IERC721 _nft, uint256 _tokenId) {
        if (s_listings[_nft][_tokenId].price == 0)
            revert NotListed(address(_nft), _tokenId);

        _;
    }

    modifier isNotListed(IERC721 _nft, uint256 _tokenId) {
        if (s_listings[_nft][_tokenId].price > 0)
            revert AlreadyListed(address(_nft), _tokenId);

        _;
    }

    modifier isOwner(
        IERC721 _nft,
        uint256 _tokenId,
        address _sender
    ) {
        if (_nft.ownerOf(_tokenId) != _sender)
            revert NotOwner(address(_nft), _tokenId);
        _;
    }

    /* -------------------------------- Functions ------------------------------- */
    /// @inheritdoc IMarket
    function listItem(
        IERC721 _nft,
        uint256 _tokenId,
        uint256 _price
    )
        external
        override
        checkNonZeroAddress(address(_nft))
        checkNonZeroValue(_price)
        isApproved(_nft, _tokenId)
        isNotListed(_nft, _tokenId)
        isOwner(_nft, _tokenId, msg.sender)
    {
        s_listings[_nft][_tokenId] = Listing(msg.sender, _price);

        emit ListedItem(msg.sender, _nft, _tokenId, _price);
    }

    /// @inheritdoc IMarket
    function buyItem(IERC721 _nft, uint256 _tokenId)
        external
        payable
        override
        nonReentrant
        checkNonZeroAddress(address(_nft))
        isListed(_nft, _tokenId)
    {
        Listing memory listing = s_listings[_nft][_tokenId];
        // Check that the correct amount of ETH was paid
        if (msg.value != listing.price) revert InvalidAmountPayed(msg.value);

        // Clear the listing
        delete s_listings[_nft][_tokenId];

        // Transfer the NFT to the buyer
        _nft.safeTransferFrom(listing.owner, msg.sender, _tokenId);

        // Add the amount of ETH owed to the seller
        s_owedProceeds[listing.owner] += listing.price;

        emit BoughtItem(
            msg.sender,
            listing.owner,
            _nft,
            _tokenId,
            listing.price
        );
    }

    /// @inheritdoc IMarket
    function withdrawItem(IERC721 _nft, uint256 _tokenId)
        external
        override
        checkNonZeroAddress(address(_nft))
        isOwner(_nft, _tokenId, msg.sender)
        isListed(_nft, _tokenId)
    {
        // Clear the listing
        delete s_listings[_nft][_tokenId];

        emit WithdrawnItem(_nft, _tokenId);
    }

    /// @inheritdoc IMarket
    function updateItem(
        IERC721 _nft,
        uint256 _tokenId,
        uint256 _newPrice
    )
        external
        override
        checkNonZeroAddress(address(_nft))
        isOwner(_nft, _tokenId, msg.sender)
        isListed(_nft, _tokenId)
    {
        // Update the listing price
        s_listings[_nft][_tokenId].price = _newPrice;

        emit UpdatedItem(msg.sender, _nft, _tokenId, _newPrice);
    }

    /// @inheritdoc IMarket
    function claimProceeds() external override nonReentrant {
        uint256 proceeds = s_owedProceeds[msg.sender];
        // Check that there's something to claim
        if (proceeds == 0) revert NoProceedsToClaim();

        // Check that the payment can be done. (Critical Failure if not)
        if (address(this).balance < proceeds) revert NotEnoughBalance();

        s_owedProceeds[msg.sender] = 0;

        // Transfer the ETH owed to the sender
        (bool success, ) = address(msg.sender).call{value: proceeds}("");

        if (!success) revert TransferFailed();

        emit ClaimedProceeds(msg.sender, proceeds);
    }

    /* ---------------------------------- Views --------------------------------- */
    function getListing(IERC721 _nft, uint256 _tokenId)
        external
        view
        override
        returns (Listing memory)
    {
        return s_listings[_nft][_tokenId];
    }

    function getOwedProceeds(address _seller)
        external
        view
        override
        returns (uint256)
    {
        return s_owedProceeds[_seller];
    }
}
