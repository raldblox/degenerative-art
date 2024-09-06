// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

interface IFeelnHandle {
    event AccountCreated(string indexed uid, address account);

    function getStorageAccount(
        string memory uid
    ) external view returns (address);

    function getUidFromWallet(
        address wallet
    ) external view returns (string memory);

    function getHandle(string memory uid) external view returns (string memory);

    function isWalletOfUid(
        string memory uid,
        address wallet
    ) external view returns (bool);

    function uidExist(string memory uid) external view returns (bool);
}
