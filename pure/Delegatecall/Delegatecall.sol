// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract Delegator {
    uint256 public myNum;
    address public sender;
    uint256 public value;

    // Delegator's storage is set. Implementer's is not modified!
    function setVars(address _contract, uint256 _myNum) public payable {
        (bool success, bytes memory data) = _contract.delegatecall(
            abi.encodeWithSignature("setVars(uint256)", _myNum)
        );
    }
}

contract Implementer {
    uint256 public num;
    address public sender;
    uint256 public value;

    function setVars(uint256 _num) public payable {
        num = _num;
        sender = msg.sender;
        value = msg.value;
    }
}

contract ModifiedDelegator {
    bool public myBool; // Changing this type
    address public sender;
    uint256 public value;

    // Delegator's storage is set. Implementer's is not modified!
    // Now the bool variable is still gonna be modified!
    // As an oversight, this can caus unexpected behaviour!
    function setVars(address _contract, uint256 _myNum) public payable {
        (bool success, bytes memory data) = _contract.delegatecall(
            abi.encodeWithSignature("setVars(uint256)", _myNum)
        );
    }
}
