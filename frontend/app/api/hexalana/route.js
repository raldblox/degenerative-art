const { NextRequest, NextResponse } = require("next/server");
const { ethers } = require("ethers");

import { networks } from "@/libraries/network";
import { aesDecrypt } from "@/providers/encryption";
import wrappedERC0ABI from "@/libraries/abis/WRAPPEDERC20.json";
import bridgeABI from "@/libraries/abis/BRIDGE.json";

export const runtime = "edge";

async function bridge(
  sourceChain,
  destinationChain,
  sender,
  receiver,
  tokenAddress,
  tokenAmount
) {
  try {
    const source = networks.find((n) => n.chainId === Number(sourceChain));
    const destination = networks.find(
      (n) => n.chainId === Number(destinationChain)
    );

    const providerSource = new ethers.JsonRpcProvider(source.rpcUrls[0]);
    const hexalanaWalletSource = new ethers.Wallet(
      process.env.HEXALANA_PRIVATE_KEY,
      providerSource
    );
    const sourceBridge = new ethers.Contract(
      source?.contracts?.hexalanaBridge,
      bridgeABI,
      hexalanaWalletSource
    );
    const destinationSource = new ethers.JsonRpcProvider(
      destination.rpcUrls[0]
    );
    const hexalanaWalletDestination = new ethers.Wallet(
      process.env.HEXALANA_PRIVATE_KEY,
      destinationSource
    );
    const destinationBridge = new ethers.Contract(
      destination?.contracts?.hexalanaBridge,
      bridgeABI,
      hexalanaWalletDestination
    );

    console.log("Bridge instances loaded");
    console.log(`Checking:${tokenAddress}`);
    const isTokenSupportedOnSource = await sourceBridge.supportedTokens(
      tokenAddress
    );

    if (!isTokenSupportedOnSource) {
      throw new Error(
        `Token ${tokenAddress} is not supported on ${source.chainName}`
      );
    } else {
      console.log(`token in source is supported`);
    }

    const isTokenSupportedOnDestination = await destinationBridge.supportedTokens(
      tokenAddress
    );

    if (!isTokenSupportedOnDestination) {
      throw new Error(
        `Token ${tokenAddress} is not supported on ${destination.chainName}`
      );
    } else {
      console.log(`token in destination is supported`);
    }

    let unlockTxhash;
    console.log(tokenAddress, receiver, tokenAmount, sourceChain);
    try {
      const unlockTx = await destinationBridge.unlockTokens(
        tokenAddress,
        receiver,
        BigInt(tokenAmount),
        sourceChain
      );
      await unlockTx.wait();
      unlockTxhash = unlockTx.hash;
    } catch (error) {
      console.error(`Error unlocking tokens:`, error);
    }

    return { unlockTxhash };
  } catch (error) {
    console.error("Error bridging:", error);
    throw error;
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
    const { encryptedData } = await request.json();

    const {
      action,
      sourceChain,
      destinationChain,
      sender,
      receiver,
      tokenAddress,
      tokenAmount,
    } = await aesDecrypt(encryptedData);

    console.log(
      "Transacting:",
      action,
      sourceChain,
      destinationChain,
      sender,
      receiver,
      tokenAddress,
      tokenAmount
    );

    // return NextResponse.json(
    //   { message: "Success", lockTxhash: "hash1", unlockTxhash: "hash2" },
    //   { status: 201 }
    // );

    if (action === "bridge") {
      const { unlockTxhash } = await bridge(
        sourceChain,
        destinationChain,
        sender,
        receiver,
        tokenAddress,
        tokenAmount
      );
      return NextResponse.json(
        { message: "Success", unlockTxhash },
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
