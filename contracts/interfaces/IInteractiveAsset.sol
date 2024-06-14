// SPDX-License-Identifier: MIT License

pragma solidity ^0.8.24;

interface IInteractiveAsset {
    function viewAsset() external view returns (string memory);
}
