// SPDX-License-Identifier: MIT License
pragma solidity ^0.8.1;

interface IXPClaimer {
    function claimXP(
        address user,
        uint256 quantity,
        address reward
    ) external returns (bool);

    function getPrice(
        address reward,
        uint256 quantity
    ) external returns (uint256 xp);
}
