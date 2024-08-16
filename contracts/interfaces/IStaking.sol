// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IStaking {
    function staked(uint256 tokenId) external view returns (bool);
}
