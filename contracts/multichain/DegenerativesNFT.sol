// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DegenerativesNFT {
    uint256 public immutable chainId;

    constructor(uint256 _chainId, address moodBank) {
        chainId = _chainId;
    }

    function _pay(address receiver, uint256 tokenId) internal returns (bool) {}

    function _mintToken(
        address receiver,
        uint256 tokenId
    ) internal returns (bool) {}
}
