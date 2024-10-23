const { NextRequest, NextResponse } = require("next/server");
const { ethers, BigNumber } = require("ethers");
import ERC0ABI from "@/libraries/abis/WRAPPEDERC20.json";
import {
  computePoolAddress,
  FeeAmount,
  Pool,
  Route,
  SwapQuoter,
  SwapRouter,
  Trade,
} from "@uniswap/v3-sdk";
import {
  CurrencyAmount,
  Percent,
  SupportedChainId,
  Token,
  TradeType,
} from "@uniswap/sdk-core";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import JSBI from "jsbi";

export const runtime = "edge";

export const WETH_TOKEN = new Token(
  8453,
  "0x4200000000000000000000000000000000000006",
  18,
  "WETH",
  "Wrapped Ether"
);

export const USDC_TOKEN = new Token(
  8453,
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  6,
  "USDC",
  "USD Coin"
);

export const BTURB_TOKEN = new Token(
  8453,
  "0x113E67720A24EC1Ae8fcB5F7c18A0C3B27aBF1A6",
  18,
  "BTURB",
  "Based BabyTurbo"
);

export const CurrentConfig = {
  tokens: {
    in: WETH_TOKEN,
    out: BTURB_TOKEN,
    poolFee: 10000,
    amountIn: 0.0025,
  },
};

export const MAX_FEE_PER_GAS = 100000000000;
export const MAX_PRIORITY_FEE_PER_GAS = 100000000000;
const SWAP_ROUTER_ADDRESS = "0x2626664c2603336E57B271c5C0b26F421741e481";

const rpcUrl = "https://mainnet.base.org";
const POOL_FACTORY_CONTRACT_ADDRESS =
  "0x33128a8fC17869897dcE68Ed026d694621f6FDfD";

async function getPoolInfo() {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    const wallet = new ethers.Wallet(process.env.BTURB_PRIVATE_KEY, provider);

    const currentPoolAddress = computePoolAddress({
      factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
      tokenA: CurrentConfig.tokens.in,
      tokenB: CurrentConfig.tokens.out,
      fee: CurrentConfig.tokens.poolFee,
      chainId: 8453,
    });

    console.log("currentPoolAddress:", currentPoolAddress);

    const poolContract = await new ethers.Contract(
      currentPoolAddress,
      IUniswapV3PoolABI.abi,
      wallet
    );

    const quoterContract = new ethers.Contract(
      "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a",
      Quoter.abi,
      wallet
    );

    // const slot0 = await poolContract.slot0();
    // console.log("slot0:", slot0); // [ 13387696387541789983763637n, -173724n, 0n, 1n, 1n, 0n, true ]

    const [token0, token1, fee, liquidity, slot0] = await Promise.all([
      CurrentConfig.tokens.token0,
      CurrentConfig.tokens.token1,
      poolContract.fee(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);

    const formattedSlot0 = {
      sqrtPriceX96: slot0[0].toString(),
      tick: slot0[1].toString(),
      observationIndex: slot0[2].toString(),
      observationCardinality: slot0[3].toString(),
      observationCardinalityNext: slot0[4].toString(),
      feeProtocol: slot0[5].toString(),
      unlocked: slot0[6],
    };

    return {
      token0,
      token1,
      fee: Number(fee),
      liquidity: liquidity.toString(),
      sqrtPriceX96: formattedSlot0.sqrtPriceX96,
      tick: formattedSlot0.tick,
    };
  } catch (error) {
    console.error("Error bridging:", error);
    throw error;
  }
}

async function getQuote(token0, token1, fee, amountIn) {
  try {
    const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
    const wallet = new ethers.Wallet(process.env.BTURB_PRIVATE_KEY, provider);
    const quoterContract = new ethers.Contract(
      "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a",
      Quoter.abi,
      provider
    );

    console.log("WETH9:", await quoterContract.WETH9());

    if (token0.toLowerCase() > token1.toLowerCase()) {
      [token0, token1] = [token1, token0];
    }

    const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
      token0,
      token1,
      fee,
      ethers.parseUnits(amountIn.toString()),
      0
    );

    console.log("quotedAmountOut:", quotedAmountOut);

    return {
      quotedAmountOut,
    };
  } catch (error) {}
}

async function getOutputQuote(route) {
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const quoterInterface = new ethers.Interface(Quoter.abi);

  if (!provider) {
    throw new Error("Provider required to get pool state");
  }

  const { calldata } = await SwapQuoter.quoteCallParameters(
    route,
    CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.in,
      ethers.parseUnits(CurrentConfig.tokens.amountIn.toString()).toString()
    ),
    TradeType.EXACT_INPUT,
    {
      useQuoterV2: true,
    }
  );

  const quoteCallReturnData = await provider.call({
    to: "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a",
    data: calldata,
  });

  console.log("quoteCallReturnData", quoteCallReturnData);

  const decodedData = quoterInterface.decodeFunctionResult(
    "quoteExactInputSingle",
    quoteCallReturnData
  );

  return decodedData;
}

export async function getTokenTransferApproval(token) {
  const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
  const wallet = new ethers.Wallet(process.env.BTURB_PRIVATE_KEY, provider);
  const address = await wallet.getAddress();
  console.log("address", address);
  if (!provider || !address) {
    console.log("No Provider Found");
    return "Failed";
  }

  try {
    const tokenContract = new ethers.Contract(token.address, ERC0ABI, wallet);
    const amount = ethers.parseUnits("0.0025", token.decimals);
    const transaction = await tokenContract.approve(
      SWAP_ROUTER_ADDRESS,
      amount
    );

    const txReceipt = await transaction.wait();
    const hash = txReceipt.hash;
    console.log(txReceipt.hash);

    return { hash, address };
  } catch (e) {
    console.error(e);
    return "Failed";
  }
}

export async function GET() {
  try {
    return NextResponse.json({ message: "Hello Hexalana" });
  } catch (error) {
    console.error("Error in fetch API route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { action } = await request.json();

    console.log("Transacting:", action);

    if (action === "getPool") {
      const {
        token0,
        token1,
        fee,
        liquidity,
        sqrtPriceX96,
        tick,
      } = await getPoolInfo();

      //   await getQuote(token0, token1, fee, "0.0002");

      const pool = new Pool(
        token0,
        token1,
        CurrentConfig.tokens.poolFee,
        sqrtPriceX96.toString(),
        liquidity.toString(),
        Number(tick)
      );

      const swapRoute = new Route(
        [pool],
        CurrentConfig.tokens.in,
        CurrentConfig.tokens.out
      );

      const amountOut = await getOutputQuote(swapRoute);

      console.log("amountOut", amountOut);

      const uncheckedTrade = Trade.createUncheckedTrade({
        route: swapRoute,
        inputAmount: CurrencyAmount.fromRawAmount(
          CurrentConfig.tokens.in,
          ethers.parseUnits(CurrentConfig.tokens.amountIn.toString()).toString()
        ),
        outputAmount: CurrencyAmount.fromRawAmount(
          CurrentConfig.tokens.out,
          JSBI.BigInt(amountOut[0])
        ),
        tradeType: TradeType.EXACT_INPUT,
      });
      console.log("uncheckedTrade", uncheckedTrade);

      const tokenApproval = await getTokenTransferApproval(
        CurrentConfig.tokens.in
      );

      console.log("tokenApproval", tokenApproval.hash, tokenApproval.address);

      const options = {
        slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
        deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
        recipient: tokenApproval.address,
        value: CurrencyAmount.fromRawAmount(WETH_TOKEN, "0"),
      };

      console.log("options:", options);

      const methodParameters = SwapRouter.swapCallParameters(
        [uncheckedTrade],
        options
      );

      console.log("methodParameters:", methodParameters);

      const tx = {
        data: methodParameters.calldata,
        to: SWAP_ROUTER_ADDRESS,
        value: methodParameters.value,
        from: tokenApproval.address,
        maxFeePerGas: MAX_FEE_PER_GAS,
        maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
      };

      const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
      const wallet = new ethers.Wallet(process.env.BTURB_PRIVATE_KEY, provider);

      console.log("tx value:", tx.value);

      console.log("transaction", tx);

      const txRes = await wallet.sendTransaction(tx);

      let receipt = null;

      while (receipt === null) {
        try {
          receipt = await provider.getTransactionReceipt(txRes.hash);

          if (receipt === null) {
            continue;
          }
        } catch (e) {
          console.log(`Receipt error:`, e);
          break;
        }
      }

      return NextResponse.json(
        {
          message: "Success",
          token0,
          token1,
          fee,
          liquidity,
          sqrtPriceX96,
          tick,
          tokenApproval,
          receipt,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error", error: error.message }, // Include error message
      { status: 500 }
    );
  }
}

const READABLE_FORM_LEN = 4;

export function fromReadableAmount(amount) {
  return ethers.parseUnits(amount.toString());
}

export function toReadableAmount(rawAmount, decimals) {
  return ethers.formatUnits(rawAmount, decimals).slice(0, READABLE_FORM_LEN);
}
