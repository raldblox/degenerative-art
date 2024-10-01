// SPDX-License-Identifier: MIT
// OnChainVision Contracts

pragma solidity ^0.8.24;

interface IVisualEngine {
    function generateMetadata(
        uint256,
        address,
        string[] memory,
        uint256
    ) external view returns (string memory);
}
