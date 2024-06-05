// SPDX-License-Identifier: MIT License
pragma solidity ^0.8.1;

interface IExplorer {
    function registerAsset(
        address creator,
        string memory name,
        address asset,
        bool isInteractive
    ) external returns (bool);
}
