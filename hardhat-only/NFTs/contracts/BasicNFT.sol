// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./abstract/Base.sol";

contract BasicNFT is ERC721, Base {
    /// @dev Hardcoded URI for the sake of this basic NFT example.
    string public constant TOKEN_URI =
        "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";

    uint256 private s_tokenCounter;

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {}

    function mint() external returns (uint256 tokenId) {
        _safeMint(msg.sender, s_tokenCounter, "");
        tokenId = s_tokenCounter;
        s_tokenCounter++;
    }

    function tokenURI(
        uint256 //tokenId
    ) public view override returns (string memory) {
        return TOKEN_URI;
    }

    /* ---------------------------------- Views --------------------------------- */
    function getTokenCounter() external view returns (uint256) {
        return s_tokenCounter;
    }
}
