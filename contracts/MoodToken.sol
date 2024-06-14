// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MoodToken is ERC20, Ownable(msg.sender) {
    constructor() ERC20("Mood Token", "Mood") {
        _mint(msg.sender, 1e12 * 10e16);
    }

    // Burn function to destroy tokens
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    receive() external payable {}
}
