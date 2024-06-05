// SPDX-License-Identifier: MIT
// OnChainVision Contracts

pragma solidity ^0.8.1;

interface IVisualEngine {
    function generateMetadata(
        uint256 tokenId,
        address owner,
        string[] memory
    ) external view returns (string memory);
}
