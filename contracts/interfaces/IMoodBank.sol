// SPDX-License-Identifier: MIT
// OnChainVision Contracts

pragma solidity ^0.8.24;

struct Mood {
    uint256 chainId;
    uint256 tokenId;
    uint256 timeStamp;
    string[] emojis;
}

interface IMoodBank {
    function addMood(
        uint256 chainId,
        uint256 tokenId,
        address user,
        string[] memory mood
    ) external payable returns (bool);

    function getMoodById(
        uint256 moodId
    ) external view returns (string[] memory);

    function getMoodLength(uint256 moodId) external view returns (uint256);

    function getUserMoodLength(address user) external view returns (uint256);

    function getMoodDataByIndex(
        address user,
        uint256 i
    ) external view returns (Mood memory);

    function getLatestMoodByUser(
        address user
    ) external view returns (string[] memory);

    function getMoodIdToTokenId(
        address user,
        uint256 i
    ) external view returns (Mood memory);
}
