// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IPricer {
    function price(
        uint256 tokenId,
        address paymentToken
    ) external view returns (bool tokenAllowed, uint256 tokenValue);
}
