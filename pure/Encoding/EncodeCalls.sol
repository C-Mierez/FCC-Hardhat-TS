// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

// It is possible to manually create the encoding of the data field that is gonna be sent
// when a function call is made.
//
// There are some low-level keywords on Solidity that allow us to populate this field
// These are "staticcall" and "call"
// - call: The function can change the state of the blockchain
// - staticcall: This is how "view" or "pure" functions are called
//
// When using call{}() we have:
// - {}: Pass the specific fields of the transaction (value, gas, nonce...)
// - (): Pass the "data" field, used for calling specific functions. In some cases this can be empty
//
// In order to call any function, we need to encode the data field down to its binary level. This is:
// - Function Name
// - Parameters
//
// Each contract assigns a unique "function selector" to each function. Composed of:
// - Function Selector: First 4 bytes of the signature.
// - Function Signature: A String that defines the function name and parameters.

contract EncodeCalls {
    address public s_address;
    uint256 public s_amount;

    // For the following function, we get:
    // - Function selector: 0xa9059cbb
    // - Function signature: transfer(address,uint256)
    function transfer(address _to, uint256 _amount) public {
        s_address = _to;
        s_amount = _amount;
    }

    // There are a few ways to get the selector of a function

    // This returns 0xa9059cbb
    function getTransferSelector1() public pure returns (bytes4 selector) {
        selector = bytes4(keccak256(bytes("transfer(address,uint256)")));
    }

    // Now we need to encode the parameters as well
    // This returns the entire encoded binary that we can use to call the function (This is the Data field)
    function getDataToCall(address _address, uint256 _amount)
        public
        pure
        returns (bytes memory)
    {
        return
            abi.encodeWithSelector(getTransferSelector1(), _address, _amount);
    }

    // Calling the function using the Data field created from scratch:
    function callTransferFromBinary(
        address _receiver,
        address _to,
        uint256 _amount
    ) public returns (bytes4, bool) {
        // Hard-coding for this example:
        _receiver = address(this);

        (bool success, bytes memory returnData) = _receiver.call(
            getDataToCall(_to, _amount)
        );
        return (bytes4(returnData), success);
    }

    // Another way of doing it
    function callTransferFromBinary2(
        address _receiver,
        address _to,
        uint256 _amount
    ) public returns (bytes4, bool) {
        // Hard-coding for this example:
        _receiver = address(this);

        (bool success, bytes memory returnData) = _receiver.call(
            abi.encodeWithSelector(getTransferSelector1(), _to, _amount)
        );
        return (bytes4(returnData), success);
    }

    // And yet another way
    function callTransferFromBinary3(
        address _receiver,
        address _to,
        uint256 _amount
    ) public returns (bytes4, bool) {
        // Hard-coding for this example:
        _receiver = address(this);

        (bool success, bytes memory returnData) = _receiver.call(
            // This performs the bytes4(keccak256(bytes("transfer(address,uint256)"))) for us
            abi.encodeWithSignature("transfer(address,uint256)", _to, _amount)
        );
        return (bytes4(returnData), success);
    }

    // Other ways to get selectors:
    function getTransferSelector2() public pure returns (bytes4 selector) {
        bytes memory functionCallData = abi.encodeWithSignature(
            "transfer(address,uint256)",
            address(0),
            123
        );

        selector = bytes4(
            bytes.concat(
                functionCallData[0],
                functionCallData[1],
                functionCallData[2],
                functionCallData[3]
            )
        );
    }
}
