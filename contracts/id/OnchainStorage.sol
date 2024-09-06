// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "./interfaces/IFeelnStorage.sol";

contract OnchainStorage is IFeelnStorage {
    string private uid;
    address public manager;
    address private primaryWallet;
    address[] private wallets;
    mapping(address => bool) private walletExists;

    uint postIds;

    mapping(uint256 => string[]) private emojis;
    mapping(uint256 => string[]) private images;
    mapping(uint256 => string[]) private notes;

    constructor(string memory _uid) {
        uid = _uid;
        manager = msg.sender;
    }

    modifier onlyAuthorized() {
        require(
            msg.sender == manager || walletExists[msg.sender],
            "Unauthorized"
        );
        _;
    }

    function bind(address wallet) public onlyAuthorized returns (bool) {
        require(!walletExists[wallet], "Wallet already bound");

        wallets.push(wallet);
        walletExists[wallet] = true;
        return true;
    }

    function post(
        string[] memory _emojis,
        string[] memory _image,
        string[] memory _notes
    ) public onlyAuthorized returns (bool) {
        emojis[postIds] = _emojis;
        images[postIds] = _image;
        notes[postIds] = _notes;
        postIds++;
        return true;
    }

    function setPrimaryWallet(address wallet) public onlyAuthorized {
        require(walletExists[wallet], "Wallet not bound");
        primaryWallet = wallet;
    }

    function uidWallet(address wallet) public view returns (bool) {
        return walletExists[wallet];
    }

    function getPost(
        uint postId
    ) public view returns (string[] memory, string[] memory, string[] memory) {
        return (emojis[postId], images[postId], notes[postId]);
    }

    function getWallets() public view returns (address[] memory) {
        return wallets;
    }

    function getPrimaryWallet() external view returns (address) {
        return primaryWallet;
    }

    function destroy() public onlyAuthorized {
        selfdestruct(payable(manager));
    }
}
