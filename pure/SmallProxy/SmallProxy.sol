// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/proxy/Proxy.sol";

contract SmallProxy is Proxy {
    // The keccack256 hash of "eip1967.proxy.implementation" substracted by 1
    bytes32 private constant _IMPLEMENTATION_SLOT =
        0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    function setImplementation(address _newImp) public {
        assembly {
            sstore(_IMPLEMENTATION_SLOT, _newImp)
        }
    }

    function _implementation()
        internal
        view
        override
        returns (address implementationAddress)
    {
        assembly {
            implementationAddress := sload(_IMPLEMENTATION_SLOT)
        }
    }

    function readStorage()
        public
        view
        returns (uint256 valueAtStorageSlotZero)
    {
        assembly {
            valueAtStorageSlotZero := sload(0)
        }
    }

    function getDataToTransact(uint256 _numberToUpdate)
        public
        pure
        returns (bytes memory)
    {
        return abi.encodeWithSignature("setValue(uint256)", _numberToUpdate);
    }
}

contract ImplementationA {
    uint256 public value;

    function setValue(uint256 _value) public {
        value = _value;
    }
}

contract ImplementationB {
    uint256 public value;

    function setValue(uint256 _value) public {
        value = _value * 2;
    }
}
