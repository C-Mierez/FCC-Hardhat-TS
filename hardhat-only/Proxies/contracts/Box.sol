// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract Box {
    uint256 internal constant VERSION = 1;

    uint256 internal value;

    event ChangedValue(uint256 newValue);

    function store(uint256 _value) external {
        value = _value;
        emit ChangedValue(value);
    }

    function getValue() external view returns (uint256) {
        return value;
    }

    function getVersion() external pure returns (uint256) {
        return VERSION;
    }
}
