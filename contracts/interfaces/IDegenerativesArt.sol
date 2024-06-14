// SPDX-License-Identifier: MIT
// OnChainVision Contracts

pragma solidity ^0.8.24;

struct MoodData {
    uint256 tokenId;
    uint256 timeStamp;
    string[] emojis;
}

interface IDegenerativesArt {
    function getMoodSwing(uint256 tokenId) external view returns (uint256);

    function getEmojis(uint256 tokenId) external view returns (string[] memory);

    function getMoodPattern(
        address owner
    ) external view returns (MoodData[] memory);
}
