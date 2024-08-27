// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MoodToken is ERC20("Test MOOD", "test MOOD"), Ownable(msg.sender) {
    constructor() {
        _mint(msg.sender, 100000000 * 10e18);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }

    receive() external payable {}
}
