// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "./abstract/Base.sol";
import "./interfaces/IUselessBank.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract UselessBank is IUselessBank, Base {
    address private immutable i_owner;

    /// @notice Stores the user's balance of a certain token.
    /// User -> Token -> Balance
    mapping(address => mapping(IERC20 => uint256)) private s_balanceOf;

    /// @notice Stores whether a certain token is allowed to be used.
    mapping(IERC20 => bool) private s_allowedTokens;

    constructor(IERC20 _token) checkNonZeroAddress(address(_token)) {
        s_allowedTokens[_token] = true;
        i_owner = msg.sender;
    }

    /* -------------------------------- Modifiers ------------------------------- */
    modifier checkAllowedToken(IERC20 _token) {
        if (!s_allowedTokens[_token]) revert UnauthorizedToken(_token);
        _;
    }

    /* -------------------------------- Functions ------------------------------- */
    function deposit(IERC20 _token, uint256 _amount)
        external
        override
        checkNonZeroAddress(address(_token))
        checkNonZeroValue(_amount)
        checkAllowedToken(_token)
    {
        s_balanceOf[msg.sender][_token] += _amount;

        emit Deposited(msg.sender, _token, _amount);

        _token.transferFrom(msg.sender, address(this), _amount);
    }

    function withdraw(IERC20 _token, uint256 _amount)
        external
        override
        checkNonZeroAddress(address(_token))
        checkNonZeroValue(_amount)
        checkAllowedToken(_token)
    {
        if (s_balanceOf[msg.sender][_token] < _amount)
            revert NotEnoughBalance();

        s_balanceOf[msg.sender][_token] -= _amount;

        emit Withdrawn(msg.sender, _token, _amount);

        _token.transfer(msg.sender, _amount);
    }

    function authorizeToken(IERC20 _token, bool _allow)
        external
        override
        checkNonZeroAddress(address(_token))
        checkExpectedCaller(msg.sender, i_owner)
    {
        s_allowedTokens[_token] = _allow;

        emit TokenUpdated(_token, _allow);
    }

    /* ---------------------------------- Views --------------------------------- */
    function getBalanceOf(IERC20 _token, address _user)
        external
        view
        override
        returns (uint256 balance)
    {
        balance = s_balanceOf[_user][_token];
    }

    function getOwner() external view returns (address owner) {
        owner = i_owner;
    }

    function isAuthorized(IERC20 _token) external view returns (bool) {
        return s_allowedTokens[_token];
    }
}
