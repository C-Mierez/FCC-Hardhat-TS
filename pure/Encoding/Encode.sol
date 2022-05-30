// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

/// @title Encoding
/// @author C-Mierez
/// @notice Just a contract highlighting some basic behavior of the Encoding functionality in Solidity

contract Encode {
    // Before Solidity version 0.8.12 this was the way to concatenate strings:
    function concatStrings(string calldata _str1, string calldata _str2)
        public
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(_str1, " ", _str2));
    }

    // In Solidity 0.8.12 and later, this is the way to concatenate strings:
    function concatStrings2(string calldata _str1, string calldata _str2)
        public
        pure
        returns (string memory)
    {
        return string(string.concat(_str1, " ", _str2));
    }

    // Looking into the encode methods,
    // some examples could be:

    // Encoding _num = 1 would returns a result of 0x000...001
    function encodeNumber(uint256 _num) public pure returns (bytes memory) {
        bytes memory encodedNum = abi.encode(_num);
        return encodedNum;
    }

    // Encoding _str = "some string" would return a result of 0x000...ABC
    // This takes up the entire size of a bytes32
    function encodeString(string memory _str)
        public
        pure
        returns (bytes memory)
    {
        bytes memory encodedStr = abi.encode(_str);
        return encodedStr;
    }

    // Encoding _str = "some string" would return a result of 0xABC
    // If the encoded string is shorter, it will not take up the entire space
    function encodePackedString(string memory _str)
        public
        pure
        returns (bytes memory)
    {
        bytes memory encodedStr = abi.encodePacked(_str);
        return encodedStr;
    }

    // Casting a string to bytes serves a very similar purpose to abi.encodePacked()
    // The result would be the same in the previous example
    // Further explanation: https://forum.openzeppelin.com/t/abi-encode-vs-abi-encodepacked/2948
    function encodeBytesString(string memory _str)
        public
        pure
        returns (bytes memory)
    {
        bytes memory encodedStr = bytes(_str);
        return encodedStr;
    }

    // It is possible to decode data that has been encoded.
    // This decoded data can then be interpreted as a specified type.
    function decodeString() public pure returns (string memory decodedStr) {
        decodedStr = abi.decode(encodeString("some string"), (string));
    }

    // Multiple pieces of data can be encoded together
    function multiEncodeStrings(string memory _str1, string memory _str2)
        public
        pure
        returns (bytes memory)
    {
        bytes memory encodedStr = abi.encode(_str1, _str2);
        return encodedStr;
    }

    // And this data can be decoded as well, as long as padding was added between each piece
    // This function would correctly return ("some string", "some other string")
    function multiDecodeStrings()
        public
        pure
        returns (string memory decodedStr1, string memory decodedStr2)
    {
        bytes memory encodedStr = multiEncodeStrings(
            "some string",
            "some other string"
        );
        (decodedStr1, decodedStr2) = abi.decode(encodedStr, (string, string));
    }

    // However, behavior is different when using encodePacked
    function multiEncodePackedStrings(string memory _str1, string memory _str2)
        public
        pure
        returns (bytes memory encodedStr)
    {
        encodedStr = abi.encodePacked(_str1, _str2);
        return encodedStr;
    }

    // Multi-decoding does not work!
    function multiDecodePackedStrings()
        public
        pure
        returns (string memory decodedStr1, string memory decodedStr2)
    {
        bytes memory encodedStr = multiEncodePackedStrings(
            "some string",
            "some other string"
        );
        (decodedStr1, decodedStr2) = abi.decode(encodedStr, (string, string));
    }

    // But this can be done instead
    function multiCastPackedStrings()
        public
        pure
        returns (string memory decodedStr)
    {
        bytes memory encodedStr = multiEncodePackedStrings(
            "some string",
            "some other string"
        );
        decodedStr = string(encodedStr);
    }
}
