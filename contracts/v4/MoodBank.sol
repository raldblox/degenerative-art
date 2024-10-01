// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../interfaces/IMoodBank.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MoodBank is Ownable(msg.sender), IMoodBank {
    constructor() {}

    uint256 totalMood;

    mapping(uint256 => address) public owners;
    mapping(address => bool) public authorized;
    mapping(address => Mood[]) public userMoods;
    mapping(address => uint256[]) public moodIds;
    mapping(uint256 => string[]) public moods;
    mapping(address => string[]) public latestMoods;
    mapping(bytes32 => address[]) public moodUsers;
    mapping(bytes32 => string[]) public hashToMood;
    mapping(bytes32 => uint256) public hashToId;

    function addMood(
        uint256 chainId,
        address user,
        string[] memory mood
    ) external payable returns (uint256) {
        require(authorized[msg.sender], "caller not authorized");
        require(user != address(0), "zero address");
        require(mood.length > 0, "no mood");
        uint256 newMoodId = totalMood;

        latestMoods[user] = mood;
        userMoods[user].push(Mood(chainId, block.timestamp, mood));
        moodIds[user].push(newMoodId);
        moods[newMoodId] = mood;
        owners[newMoodId] = user;

        bytes32 moodHash = _hash(mood);
        moodUsers[moodHash].push(user);
        hashToMood[moodHash] = mood;
        hashToId[moodHash] = newMoodId;

        totalMood++;
        return newMoodId;
    }

    function authorize(address addr, bool isAuthorized) external onlyOwner {
        authorized[addr] = isAuthorized;
    }

    function getMoodById(
        uint256 moodId
    ) external view returns (string[] memory) {
        return moods[moodId];
    }

    function getOwner(uint256 moodId) external view returns (address) {
        return owners[moodId];
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

    function getMoodOfHash(
        bytes32 moodHash
    ) external view returns (string[] memory) {
        return hashToMood[moodHash];
    }

    function getMoodIdOfHash(bytes32 moodHash) external view returns (uint256) {
        return hashToId[moodHash];
    }

    function getMoodUserCount(
        string[] memory mood
    ) external view returns (uint256) {
        bytes32 moodHash = _hash(mood);
        return moodUsers[moodHash].length;
    }

    function getMoodUserByIndex(
        string[] memory mood,
        uint256 index
    ) external view returns (address) {
        bytes32 moodHash = _hash(mood);
        return moodUsers[moodHash][index];
    }

    function _hash(string[] memory characters) public pure returns (bytes32) {
        string memory chars;
        for (uint256 i = 0; i < characters.length; i++) {
            chars = string.concat(chars, characters[i]);
        }
        return keccak256(abi.encodePacked(chars));
    }
}
