// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/interfaces/IERC20.sol";

interface IUselessBank {
    /* --------------------------------- Structs -------------------------------- */

    /* --------------------------------- Events --------------------------------- */
    event Deposited(address user, IERC20 token, uint256 amount);
    event Withdrawn(address user, IERC20 token, uint256 amount);
    event TokenUpdated(IERC20 token, bool allow);

    /* --------------------------------- Errors --------------------------------- */
    /// @notice Emitted when the user's balance is lower than requested.
    error NotEnoughBalance();

    /// @notice Emitted when the submitted token is not allowed.
    error UnauthorizedToken(IERC20 token);

    /* -------------------------------- Functions ------------------------------- */

    function deposit(IERC20 _token, uint256 _amount) external;

    function withdraw(IERC20 _token, uint256 _amount) external;

    function authorizeToken(IERC20 _token, bool _allow) external;

    /* ---------------------------------- Views --------------------------------- */

    function getBalanceOf(IERC20 _token, address _user)
        external
        view
        returns (uint256);
}
