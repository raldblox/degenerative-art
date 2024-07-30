// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {IPricer} from "./interfaces/IPricer.sol";

contract NFTPricer is IPricer, Ownable(msg.sender) {
    mapping(address => bool) allowedTokens;
    mapping(address => uint) minTokenValue;

    constructor(address defaultToken) {
        setupToken(defaultToken, 1 ether, true);
    }

    function price(
        uint256,
        address tokenAddress
    ) public view override returns (bool, uint256) {
        return (allowedTokens[tokenAddress], minTokenValue[tokenAddress]);
    }

    function viewToken(
        address tokenAddress
    ) public view returns (bool, uint256) {
        return (allowedTokens[tokenAddress], minTokenValue[tokenAddress]);
    }

    function setupToken(
        address tokenAddress,
        uint256 tokenValue,
        bool isAllowed
    ) public onlyOwner {
        allowedTokens[tokenAddress] = isAllowed;
        minTokenValue[tokenAddress] = tokenValue;
    }
}
