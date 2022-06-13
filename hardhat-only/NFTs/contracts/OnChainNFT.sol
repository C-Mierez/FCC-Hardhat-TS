// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "base64-sol/base64.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract OnChainNFT is ERC721 {
    error InvalidTokenID(uint256 id);

    event MintedNFT(
        uint256 indexed tokenId,
        address indexed owner,
        int256 highValue
    );

    AggregatorV3Interface internal immutable i_priceFeed;

    uint256 private s_tokenCounter;

    string private i_lowSVGuri;

    string private i_highSVGuri;

    string private constant base64EncodedSVGPrefix =
        "data:image/svg+xml;base64,";

    mapping(uint256 => int256) public tokenIdToHighValue;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _lowSVG,
        string memory _highSVG,
        AggregatorV3Interface _priceFeed
    ) ERC721(_name, _symbol) {
        i_lowSVGuri = svgToBase64URI(_lowSVG);
        i_highSVGuri = svgToBase64URI(_highSVG);
        i_priceFeed = _priceFeed;
    }

    function mint(int256 _highValue) external {
        s_tokenCounter++;
        tokenIdToHighValue[s_tokenCounter] = _highValue;

        _safeMint(msg.sender, s_tokenCounter);
        emit MintedNFT(s_tokenCounter, msg.sender, _highValue);
    }

    /* ---------------------------------- Pure ---------------------------------- */
    function svgToBase64URI(string memory svg)
        public
        pure
        returns (string memory)
    {
        string memory svgBase64Encoded = Base64.encode(
            bytes(string(abi.encodePacked(svg)))
        );
        return
            string(abi.encodePacked(base64EncodedSVGPrefix, svgBase64Encoded));
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        if (!_exists(tokenId)) revert InvalidTokenID(tokenId);

        (, int256 price, , , ) = i_priceFeed.latestRoundData();

        string memory imageURI = price >= tokenIdToHighValue[tokenId]
            ? i_lowSVGuri
            : i_highSVGuri;

        return
            string(
                abi.encodePacked(
                    _baseURI(),
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name(),
                                '", "description":"An NFT that changes dynamically from on-chain data.", ',
                                '"attributes":[{"trait-type":"Mood", "value":100}], "image":"',
                                imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    }
}
