// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "../interfaces/IDegenerativesID.sol";

contract DegenerativesID is Ownable(msg.sender), Pausable, IDegenerativesID {
    uint256 public totalUser;

    constructor() {
        authorized[msg.sender] = true;
    }

    mapping(address => bool) public authorized;
    mapping(uint256 userId => User) public userData;
    mapping(string xid => uint) userIds;
    mapping(string xid => bool) registered;
    mapping(uint xid => string) userToXid;
    mapping(uint userId => address[]) userWallets;
    mapping(address wallet => uint256) walletToUserId;

    event NewUser(uint256 playerId, string uid, string name);
    event WalletBound(uint256 userId, address wallet);
    event WalletUnbound(uint256 userId, address wallet);
    event UserUpdated(uint256 userId, string name, string image);

    modifier onlyAuthorized() {
        require(authorized[msg.sender], "Caller not authorized");
        _;
    }

    function newUser(
        string memory xid,
        string memory userName,
        string memory userImage
    ) public onlyAuthorized whenNotPaused returns (uint256) {
        require(!registered[xid], "Player already registered");

        // Generate a new player ID
        totalUser++;
        uint256 newUserId = totalUser;

        // Store player data
        userIds[xid] = newUserId;
        userToXid[newUserId] = xid;
        userData[newUserId] = User({
            xid: xid,
            name: userName,
            image: userImage,
            attempts: 0,
            bestScore: 0
        });

        registered[xid] = true;

        // Emit an event to notify of the new user
        emit NewUser(newUserId, xid, userName);

        return newUserId;
    }

    function isRegistered(string memory xid) public view returns (bool) {
        return registered[xid];
    }

    function bindWallet(
        string memory xid,
        address newAddress
    ) public onlyAuthorized whenNotPaused returns (bool) {
        uint256 userId = userIds[xid];
        walletToUserId[newAddress] = userId;
        userWallets[userId].push(newAddress);
        return true;
    }

    function unbindWallet(
        address wallet
    ) public onlyAuthorized whenNotPaused returns (bool) {
        uint256 userId = walletToUserId[wallet];
        if (userId == 0) {
            revert("Wallet not bound");
        }
        walletToUserId[wallet] = 0;
        emit WalletUnbound(userId, wallet);
        return true;
    }

    function updateUser(
        uint256 userId,
        string memory newName,
        string memory newImage
    ) public onlyAuthorized {
        userData[userId].name = newName;
        userData[userId].image = newImage;

        emit UserUpdated(userId, newName, newImage);
    }

    function authorize(address wallet, bool isAuthorized) public onlyOwner {
        authorized[wallet] = isAuthorized;
    }

    function getUserDataOfUserId(
        uint256 userId
    ) public view returns (User memory) {
        return userData[userId];
    }

    function getUserIdOfXid(string memory xid) public view returns (uint256) {
        return userIds[xid];
    }

    function getXidOfUserId(
        uint256 userId
    ) public view returns (string memory) {
        return userToXid[userId];
    }

    function getWalletsOfUserId(
        uint256 userId
    ) public view returns (address[] memory) {
        return userWallets[userId];
    }

    function getXidOfWallet(
        address wallet
    ) public view returns (string memory) {
        uint256 xid = walletToUserId[wallet];
        return userToXid[xid];
    }
}
