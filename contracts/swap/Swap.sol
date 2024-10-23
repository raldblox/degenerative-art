// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(
        ExactInputSingleParams calldata params
    ) external payable returns (uint256 amountOut);

    struct ExactOutputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 amountOut;
        uint256 amountInMaximum;
        uint160 sqrtPriceLimitX96;
    }

    function exactOutputSingle(
        ExactOutputSingleParams calldata params
    ) external payable returns (uint256 amountIn);
}

interface IWETH {
    function deposit() external payable;

    function approve(address, uint) external returns (bool);

    function transfer(address, uint) external returns (bool);

    function transferFrom(address, address, uint) external returns (bool);
}

contract SwapBTURB {
    ISwapRouter public immutable swapRouter;
    address public constant BTURB = 0x113E67720A24EC1Ae8fcB5F7c18A0C3B27aBF1A6;
    address public constant WETH = 0x4200000000000000000000000000000000000006;
    uint24 public constant poolFee = 10000;

    constructor() {
        swapRouter = ISwapRouter(0x2626664c2603336E57B271c5C0b26F421741e481);
    }

    function buy(
        uint256 amountIn
    ) external payable returns (uint256 amountOut) {
        IWETH(WETH).transferFrom(msg.sender, address(this), amountIn);
        IWETH(WETH).approve(address(swapRouter), amountIn);
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: WETH,
                tokenOut: BTURB,
                fee: poolFee,
                recipient: msg.sender,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        amountOut = swapRouter.exactInputSingle(params);
    }

    function sell(uint256 amountIn) external returns (uint256 amountOut) {
        TransferHelper.safeTransferFrom(
            BTURB,
            msg.sender,
            address(this),
            amountIn
        );

        TransferHelper.safeApprove(BTURB, address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: BTURB,
                tokenOut: WETH,
                fee: poolFee,
                recipient: msg.sender,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        amountOut = swapRouter.exactInputSingle(params);
    }
}
