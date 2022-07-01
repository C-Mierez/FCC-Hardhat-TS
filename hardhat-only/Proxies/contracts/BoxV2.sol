// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract BoxV2 {
    uint256 internal constant VERSION = 2;

    uint256 internal value;

    event ChangedValue(uint256 newValue);

    function store(uint256 _value) external {
        value = _value;
        emit ChangedValue(value);
    }

    function increment() external {
        value += 1;

        emit ChangedValue(value);
    }

    function getValue() external view returns (uint256) {
        return value;
    }

    function getVersion() external pure returns (uint256) {
        return VERSION;
    }
}
