// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "./abstract/Base.sol";

/// @notice A more complex NFT that uses ChainlinkVRF to get randomness.
/// Said number will determine the NFT type to be minted.
///
/// Additionally, NFT minting will now cost some ETH
contract RandomNFT is VRFConsumerBaseV2, ERC721URIStorage, Ownable, Base {
    uint256 internal constant MAX_CHANCE_VALUE = 100;

    error OutOfBounds(uint256 value);
    error InvalidMintPayment(uint256 value);
    error TransferFailed();

    event NFTMintRequested(address indexed requester, uint256 requestId);
    event NFTMinted(address indexed owner, uint256 tokenId, uint256 requestId);

    enum Rarity {
        Rare,
        Uncommon,
        Common
    }

    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    /// @dev Stores the address of the user who requested the NFT mint.
    /// RequestID -> User
    mapping(uint256 => address) private s_requestToSender;

    uint256 private s_mintPrice;

    uint256 private s_tokenCounter;

    string[3] internal s_tokenURIs;

    constructor(
        string memory _name,
        string memory _symbol,
        address _vrfCoordinator,
        uint64 _subscriptionId,
        bytes32 _gasLane,
        uint32 _callbackGasLimit,
        string[3] memory _tokenURIs,
        uint256 _mintPrice
    ) ERC721(_name, _symbol) VRFConsumerBaseV2(_vrfCoordinator) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(_vrfCoordinator);
        i_subscriptionId = _subscriptionId;
        i_gasLane = _gasLane;
        i_callbackGasLimit = _callbackGasLimit;
        s_tokenURIs = _tokenURIs;
        s_mintPrice = _mintPrice;
    }

    function requestMint() external payable returns (uint256 requestId) {
        if (msg.value != s_mintPrice) revert InvalidMintPayment(msg.value);
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        s_requestToSender[requestId] = msg.sender;

        emit NFTMintRequested(msg.sender, requestId);
    }

    function withdrawMintFees() external onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) revert TransferFailed();
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        address requester = s_requestToSender[_requestId];
        uint256 tokenId = s_tokenCounter;

        // Calculate rarity
        // 0 - 99 total - Adjusted by the rarity array
        uint256 adjustedRandomness = getAdjustedRNG(_randomWords[0]);
        Rarity rarity = getRarity(adjustedRandomness);

        s_tokenCounter++;
        _safeMint(requester, tokenId);
        _setTokenURI(tokenId, s_tokenURIs[uint256(rarity)]);

        emit NFTMinted(requester, tokenId, _requestId);
    }

    /* ---------------------------------- Views --------------------------------- */
    function tokenURI(uint256) public view override returns (string memory) {}

    function getRequestToSender(uint256 _requestId)
        external
        view
        returns (address)
    {
        return s_requestToSender[_requestId];
    }

    function getTokenCounter() external view returns (uint256) {
        return s_tokenCounter;
    }

    function getMintPrice() external view returns (uint256) {
        return s_mintPrice;
    }

    function getTokenURI(uint256 _index) external view returns (string memory) {
        return s_tokenURIs[_index];
    }

    /* ---------------------------------- Pure ---------------------------------- */
    /// @notice Returns the chances of each NFT type as an array format.
    function getRarityChance() public pure returns (uint256[3] memory) {
        // 0: 10% chance
        // 1: 20% chance
        // 2: 60% chance
        return [10, 30, MAX_CHANCE_VALUE];
    }

    function getAdjustedRNG(uint256 _randomness)
        internal
        pure
        returns (uint256)
    {
        return _randomness % MAX_CHANCE_VALUE;
    }

    function getRarity(uint256 _adjustedRNG) public pure returns (Rarity) {
        uint256 cumulativeSum = 0;
        uint256[3] memory rarityChance = getRarityChance();

        for (uint256 i = 0; i < rarityChance.length; i++) {
            if (
                _adjustedRNG >= cumulativeSum &&
                _adjustedRNG < cumulativeSum + rarityChance[i]
            ) {
                return Rarity(i);
            }
            cumulativeSum += rarityChance[i];
        }
        revert OutOfBounds(_adjustedRNG);
    }
}
