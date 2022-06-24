// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

/* -------------------------- Global Custom Errors -------------------------- */

/// @notice Emitted when the submitted address is the zero address
error ZeroAddress();

/// @notice Emitted when the submitted value is zero.
error ZeroValue();

/// @notice Emitted when the submitted value is zero or less
/// @dev Technically uint can't be negative, so it wouldn't make
/// sense for this error to happen when [value] is an uint.
/// Hence I'm defining it as an int256 instead.
error ZeroOrNegativeValue(int256 value);

/// @notice Emitted when the caller is not the expected address
error UnexpectedCaller(address caller, address expected);

/// @notice Emitted when the caller does not have the required permissions
error UnauthorizedCaller(address caller);

/// @notice Emitted when the address does not have enough balance
error NotEnoughBalance();

error TransferFailed();

/* ---------------------------- ERC Token Errors ---------------------------- */

/// @notice Emitted when an ERC20 transfer fails. Catching boolean return from
/// the transfer methods.
/// @dev I believe it makes sense to return all the information below, since this
/// error just catches any kind of failure. It'd likely be useful to have this
/// information to understand what exactly went wrong.
error ERC20TransferFailed(address from, address to, uint256 amount);
