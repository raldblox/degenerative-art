// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LiquityToken is ERC20("LP-TOKEN", "LP") {
    constructor() {}

    function pool(uint256 lpValue) public {
        _mint(msg.sender, lpValue);
    }

    function unpool(uint256 lpValue) public {
        _burn(msg.sender, lpValue);
    }
}
