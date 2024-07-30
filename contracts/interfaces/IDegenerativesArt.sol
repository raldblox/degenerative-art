// SPDX-License-Identifier: MIT
// OnChainVision Contracts

pragma solidity ^0.8.24;

struct MoodData {
    uint256 tokenId;
    uint256 timeStamp;
    string[] emojis;
}

interface IDegenerativesArt {
    function mint(
        string[] memory _emojis,
        address themeAddress
    ) external payable;

    function upgrade(uint256 tokenId, address themeAddress) external payable;

    function update(
        uint256 tokenId,
        string[] memory newEmojis
    ) external payable;

    function getMoodSwing(uint256 tokenId) external view returns (uint256);

    function getEmojis(uint256 tokenId) external view returns (string[] memory);

    function getTheme(uint256 tokenId) external view returns (address);

    function getLastMoodUpdate(address owner) external view returns (uint256);

    function getMetadata(
        uint256 tokenId,
        address themeAddress
    ) external view returns (string memory);

    function getMoodPattern(
        address owner
    ) external view returns (MoodData[] memory);
}
