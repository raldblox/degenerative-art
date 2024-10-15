const { NextRequest, NextResponse } = require("next/server");
const { ethers } = require("ethers");
import wrappedERC0ABI from "@/libraries/abis/WRAPPEDERC20.json";
import { networks } from "@/libraries/network";

export const runtime = "edge";

export async function POST(request) {
  try {
    const {
      connectedAccount,
      sourceNetwork,
      destinationNetwork,
    } = await request.json();
    console.log(
      "checking",
      connectedAccount,
      sourceNetwork,
      destinationNetwork
    );

    const source = networks.find((n) => n.chainId === Number(sourceNetwork));
    const destination = networks.find(
      (n) => n.chainId === Number(destinationNetwork)
    );

    console.log(source?.rpcUrls[0], destination?.rpcUrls[0]);

    // get providers
    const sourceProvider = new ethers.JsonRpcProvider(source?.rpcUrls[0]);
    const destinationProvider = new ethers.JsonRpcProvider(
      destination?.rpcUrls[0]
    );

    // get instances
    const sourceERC0 = new ethers.Contract(
      source?.contracts?.MOOD,
      wrappedERC0ABI,
      sourceProvider
    );

    const destinationERC0 = new ethers.Contract(
      destination?.contracts?.MOOD,
      wrappedERC0ABI,
      destinationProvider
    );

    const destinationBalance = await destinationERC0.balanceOf(
      connectedAccount
    );
    const sourceBalance = await sourceERC0.balanceOf(connectedAccount);

    const sourceBal = ethers.formatEther(sourceBalance);
    const destinationBal = ethers.formatEther(destinationBalance);

    return NextResponse.json(
      {
        sourceBalance: sourceBal,
        destinationBalance: destinationBal,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 0,
          message: error.toString(),
        },
        data: {
          result: false,
        },
      },
      { status: 200 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    return NextResponse.json("Hello, Degeneratives.");
  } catch (error) {
    console.error("Error in fetch API route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
