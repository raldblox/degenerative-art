// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EMOJI is ERC20, Ownable(msg.sender) {
    address degeneratives;

    constructor() ERC20("EMOJI Token", "EMOJI") {
        _mint(msg.sender, 1e12 * 10e16);
    }

    // Burn function destroy tokens
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
