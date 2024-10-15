// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MOJICOIN is ERC20("Moji Coin", "MOJI") {
    ERC20 public immutable MOOD;

    event Deposit(address indexed dst, uint256 value);
    event Withdrawal(address indexed src, uint256 value);

    constructor(address _mood) {
        require(_mood != address(0), "MOJI: Invalid MOOD address");
        MOOD = ERC20(_mood);
    }

    /**
     * @dev Exchange MOOD for the same amount of MOJI.
     * @param value The amount of MOOD to exchange for MOJI
     */
    function deposit(uint256 value) public {
        require(value > 0, "MOJI: Deposit amount must be greater than 0");
        require(
            MOOD.transferFrom(msg.sender, address(this), value),
            "MOJI: MOOD transfer failed"
        );
        _mint(msg.sender, value);
        emit Deposit(msg.sender, value);
    }

    /**
     * @dev Exchange MOJI for the same amount of MOOD.
     * @param value The amount of MOJI to exchange for MOOD
     */
    function withdraw(uint256 value) public {
        require(
            balanceOf(msg.sender) >= value,
            "MOJI: Insufficient MOJI balance"
        );
        _burn(msg.sender, value);
        require(MOOD.transfer(msg.sender, value), "MOJI: MOOD transfer failed");
        emit Withdrawal(msg.sender, value);
    }
}
