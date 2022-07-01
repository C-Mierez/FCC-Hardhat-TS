// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

///! INSPIRED BY Patrick Collins' implementation
///! Using his IPFS URI
contract TestNFT is ERC721 {
    event MintedTestToken(uint256 tokenId, address owner);

    /// @dev Hardcoded since this is just a test contract.
    string public constant TOKEN_URI =
        "ipfs://QmdryoExpgEQQQgJPoruwGJyZmz6SqV4FRTX1i73CT3iXn";
    uint256 internal tokenCounter;

    constructor() ERC721("TestNFT", "TNFT") {}

    function faucet() public {
        _safeMint(msg.sender, tokenCounter);

        emit MintedTestToken(tokenCounter, msg.sender);

        tokenCounter += 1;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return TOKEN_URI;
    }

    function getTokenCounter() external view returns (uint256) {
        return tokenCounter;
    }
}
