// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./DegenerativesArt.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract Treasury is Ownable(msg.sender) {
    IERC20 public moodToken;
    IERC20 public bturbToken;
    DegenerativesArt public degenArt;

    IUniswapV2Router02 public immutable swapRouter;

    error TransferFailed();
    error InsufficientEthBalance();

    // Minimum ETH balance required for swap (0.1 ETH)
    uint256 public constant MIN_ETH_FOR_SWAP = 0.1 ether;

    constructor() {
        degenArt = DegenerativesArt(0xCF552524772605DE32DAe649f7ceD60a286b0D21);
        moodToken = IERC20(0xd08B30c1EdA1284cD70E73F29ba27B5315aCc3F9);
        bturbToken = IERC20(0xf1289118Ff03F197f0D0A50E4774984e7977965e);
        swapRouter = IUniswapV2Router02(
            0xf826A93065EfF55bF209a601eB253aD9F858287F
        );
    }

    receive() external payable {
        if (address(this).balance >= MIN_ETH_FOR_SWAP) {
            uint256 ethBalance = address(this).balance;

            // Calculate ETH amounts for each swap
            uint256 ethForBturb = (ethBalance * 15) / 100;
            uint256 ethForMood = ethBalance - ethForBturb;

            // Swap for BTURB
            address[] memory pathBturb = new address[](2);
            pathBturb[0] = swapRouter.WETH();
            pathBturb[1] = address(bturbToken);
            swapRouter.swapExactETHForTokens{value: ethForBturb}(
                0,
                pathBturb,
                address(this),
                block.timestamp
            );

            // Swap for MOOD
            address[] memory pathMood = new address[](2);
            pathMood[0] = swapRouter.WETH();
            pathMood[1] = address(moodToken);
            swapRouter.swapExactETHForTokens{value: ethForMood}(
                0,
                pathMood,
                address(this),
                block.timestamp
            );

            if (msg.sender == address(degenArt)) {
                uint256 bturbAirdrop = 2500 * 10 ** 18; // 2500 BTURB
                if (bturbToken.balanceOf(address(this)) > bturbAirdrop) {
                    uint256 tokenSupply = degenArt.totalSupply();
                    address user = degenArt.ownerOf(tokenSupply - 1);
                    bturbToken.transfer(user, bturbAirdrop);
                }
            }
        }
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
