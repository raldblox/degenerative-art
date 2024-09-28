// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../interfaces/IMoodBank.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MoodBank is Ownable(msg.sender), IMoodBank {
    constructor() {}

    uint256 totalMood;

    mapping(address => bool) private authorized;
    mapping(address => Mood[]) private userMoods;
    mapping(address => uint256[]) private moodIds;
    mapping(uint256 moodId => uint256) private tokenIds;
    mapping(uint256 moodId => string[]) private moods;
    mapping(address => string[]) private latestMoods;

    function addMood(
        uint256 chainId,
        uint256 tokenId,
        address user,
        string[] memory mood
    ) external payable returns (bool) {
        require(authorized[msg.sender], "caller not authorized");
        require(user != address(0), "zero address");
        require(mood.length > 0, "no mood");
        uint256 newMoodId = totalMood;

        latestMoods[user] = mood;
        userMoods[user].push(Mood(chainId, tokenId, block.timestamp, mood));
        moodIds[user].push(tokenId);
        tokenIds[newMoodId] = tokenId;
        moods[newMoodId] = mood;

        totalMood++;
        return true;
    }

    function authorize(address addr, bool isAuthorized) external onlyOwner {
        authorized[addr] = isAuthorized;
    }

    function getMoodById(
        uint256 moodId
    ) external view returns (string[] memory) {
        return moods[moodId];
    }

    function getMoodLength(uint256 moodId) external view returns (uint256) {
        return moods[moodId].length;
    }

    function getUserMoodLength(address user) external view returns (uint256) {
        return userMoods[user].length;
    }

    function getMoodDataByIndex(
        address user,
        uint256 i
    ) external view returns (Mood memory) {
        return userMoods[user][i];
    }

    function getLatestMoodByUser(
        address user
    ) external view returns (string[] memory) {
        return latestMoods[user];
    }

    function getMoodIdToTokenId(
        address user,
        uint256 i
    ) external view returns (Mood memory) {
        return userMoods[user][i];
    }
}
