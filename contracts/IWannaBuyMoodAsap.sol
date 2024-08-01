// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract IWannaBuyMoodAsap is Ownable(msg.sender) {
    IERC20 public moodToken;
    IUniswapV2Router02 public immutable swapRouter;

    error TransferFailed();

    constructor() {
        moodToken = IERC20(0xd08B30c1EdA1284cD70E73F29ba27B5315aCc3F9);
        swapRouter = IUniswapV2Router02(
            0xf826A93065EfF55bF209a601eB253aD9F858287F
        );
    }

    receive() external payable {
        // Swap the received ETHER for MOOD tokens and send them to the sender
        address[] memory path = new address[](2);
        path[0] = swapRouter.WETH();
        path[1] = address(moodToken);

        // Execute the swap, sending MOOD to the sender (msg.sender)
        swapRouter.swapExactETHForTokens{value: msg.value}(
            0,
            path,
            msg.sender,
            block.timestamp
        );
    }

    function recover(
        address token,
        address to,
        uint256 amount
    ) external onlyOwner {
        if (token == address(0)) {
            (bool sent, ) = payable(to).call{value: amount}("");
            if (!sent) revert TransferFailed();
        } else {
            bool sent = IERC20(token).transfer(to, amount);
            if (!sent) revert TransferFailed();
        }
    }
}
