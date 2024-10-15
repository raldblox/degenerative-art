const { NextRequest, NextResponse } = require("next/server");
const { ethers } = require("ethers");

import { networks } from "@/libraries/network";
import { aesDecrypt } from "@/providers/encryption";
import wrappedERC0ABI from "@/libraries/abis/WRAPPEDERC20.json";
import bridgeABI from "@/libraries/abis/BRIDGE.json";

export const runtime = "edge";

async function lock(
  sourceNetwork,
  destinationNetwork,
  sender,
  receiver,
  tokenAmount
) {
  try {
    const source = networks.find((n) => n.chainId === Number(sourceNetwork));
    const destination = networks.find(
      (n) => n.chainId === Number(destinationNetwork)
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
    const lockTx = await sourceBridge.lockTokens(
      source?.contracts?.MOOD,
      sender,
      tokenAmount,
      destinationNetwork
    );
    await lockTx.wait();
    const lockTxhash = lockTx.hash;

    // Listen for the TokenLocked event
    await new Promise((resolve, reject) => {
      sourceBridge.once("TokenLocked", (token, sender, amount, chainId) => {
        if (
          token === source?.contracts?.MOOD &&
          sender === sender &&
          amount === tokenAmount &&
          chainId === destinationNetwork
        ) {
          console.log("TokenLocked event received and validated!");
          resolve();
        } else {
          reject(new Error("TokenLocked event validation failed!"));
        }
      });
    });

    // Call unlockTokens with correct arguments
    const unlockTx = await destinationBridge.unlockTokens(
      destination?.contracts?.wrappedMOOD,
      receiver,
      tokenAmount,
      sourceNetwork
    );
    await unlockTx.wait();
    const unlockTxhash = unlockTx.hash;

    // Listen for the TokenUnlocked event
    await new Promise((resolve, reject) => {
      destinationBridge.once(
        "TokenUnlocked",
        (token, recipient, amount, chainId) => {
          if (
            token === destination?.contracts?.wrappedMOOD &&
            recipient === receiver &&
            amount === tokenAmount &&
            chainId === sourceNetwork
          ) {
            console.log("TokenUnlocked event received and validated!");
            resolve();
          } else {
            reject(new Error("TokenUnlocked event validation failed!"));
          }
        }
      );
    });

    return { lockTxhash, unlockTxhash };
  } catch (error) {
    console.error("Error bridging:", error);
    throw error;
  }
}

async function unlock(
  sourceNetwork,
  destinationNetwork,
  sender,
  reciever,
  tokenAmount
) {
  try {
    const source = networks.find((n) => n.chainId === Number(sourceNetwork));
    const destination = networks.find(
      (n) => n.chainId === Number(destinationNetwork)
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
    const lockTx = await sourceBridge.lockTokens(uid, playerName, playerImage);
    await lockTx.wait();
    const lockTxhash = lockTx.hash;

    //watch for TokenLocked Event to validate if it really happened

    const unlockTx = await destinationBridge.unlockTokens(
      uid,
      playerName,
      playerImage
    );
    await unlockTx.wait();
    const unlockTxhash = unlockTx.hash;

    //watch for TokenUnlocked Event to validate if it really happened

    return { lockTxhash, unlockTxhash };
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
      sourceNetwork,
      destinationNetwork,
      sender,
      reciever,
      tokenAmount,
    } = await aesDecrypt(encryptedData);

    console.log(
      "Transacting:",
      action,
      sourceNetwork,
      destinationNetwork,
      sender,
      reciever,
      tokenAmount
    );

    if (action === "bridge") {
      const { lockTxhash, unlockTxhash } = await bridge(
        sourceChain,
        destinationChain,
        sender,
        reciever,
        tokenAmount
      );
      return NextResponse.json(
        { message: "Success", lockTxhash, unlockTxhash },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.toString() },
      { status: 500 }
    );
  }
}
