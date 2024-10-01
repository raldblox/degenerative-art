const { NextRequest, NextResponse } = require("next/server");
const { ethers } = require("ethers");
import ERC721 from "@/libraries/abis/ERC721.json";

export const runtime = "edge";

export async function POST(request) {
  try {
    const { address } = await request.json();
    console.log("checking", address);

    const node = "https://rpc.coredao.org";
    const provider = new ethers.JsonRpcProvider(node);
    const interactiveCore = new ethers.Contract(
      "0x91a8c5ce0bd41488351640564bae4c8d7d8e00bd",
      ERC721,
      provider
    );
    const balance = await interactiveCore.balanceOf(address.toLowerCase());
    const result = balance > 0;

    return NextResponse.json(
      {
        data: {
          result: result,
        },
      },
      { status: 200 }
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
