// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

// Mutable variables are saved to Storage
// This is like a giant array that sequentially saves these variables, using different strategies depending
// on its type.

contract Storage {
    // Variables:
    uint256 private s_number;
    bool private s_bool;
    uint256[] private s_array;
    uint256 constant CONSTANT = 123;

    // Storage Slots:
    // [0]: s_number
    // [1]: s_bool
    // [2]: Pointer to a different slot: [keccak256(2)] from which to start storing the dynamic data
    // [3]: Empty - Constants are NOT stored in Storage - They are in the bytecode instead. Same with Immutable variables.
}
