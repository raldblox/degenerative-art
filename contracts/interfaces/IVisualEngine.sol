// SPDX-License-Identifier: MIT
// OnChainVision Contracts

pragma solidity ^0.8.24;

interface IVisualEngine {
    function generateMetadata(
        uint256 tokenId,
        address owner,
        string[] memory emojis,
        uint256 moodSwing
    ) external view returns (string memory);
}
