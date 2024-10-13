// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {WrappedERC20} from "../WrappedERC20.sol";

contract MOOD is WrappedERC20 {
    constructor(
        address _bridge
    ) WrappedERC20(_bridge, "MOOD by Degeneratives", "MOOD", 18) {}
}
