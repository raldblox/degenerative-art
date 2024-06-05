// SPDX-License-Identifier: MIT License
pragma solidity ^0.8.1;

interface IXPLogger {
    function addXP(address user, uint256 value) external returns (bool);

    function getXP(address user) external view returns (uint256);
}
