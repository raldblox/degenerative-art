// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockMOOD is ERC20("Mock MOOD", "MOOD") {
    constructor() {
        _mint(msg.sender, 1000000 * 10e18);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function mint(uint256 amount, address receiver) public {
        _mint(receiver, amount);
    }

    receive() external payable {}
}
