// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IPricer} from "./interfaces/IPricer.sol";

contract NFTPricer is IPricer {
    IERC20 public currency;

    constructor(address erc20Token) {
        currency = IERC20(erc20Token);
    }

    function price(
        uint256 tokenId,
        address
    ) public view override returns (bool, uint256) {
        //
    }
}
