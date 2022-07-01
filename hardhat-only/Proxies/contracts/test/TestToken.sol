// SPDX-License-Identifier: MIT

import "../token/Token.sol";

pragma solidity ^0.8.4;

contract TestToken is Token {
    constructor(string memory _name, string memory _symbol)
        Token(_name, _symbol)
    {}

    /// @notice Additional function for testing purposes.
    function faucet(uint256 _amount) external {
        _mint(msg.sender, _amount);
    }
}
