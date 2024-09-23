const { NextRequest, NextResponse } = require("next/server");
const { ethers } = require("ethers");
// import TokenAbi from "@/libraries/abis/Degeneratives.json";

export const runtime = "edge";

// const node = "https://rpc.coredao.org";
// const PRIVATE_KEY = process.env.PRIVATE_KEY;
// const contractAddress = "";

export async function POST(request) {
  try {
    const { address } = await request.json();
    console.log("checking", address);

    // const provider = new ethers.JsonRpcProvider(node);
    // const relayerAddress = new ethers.Wallet(PRIVATE_KEY, provider);
    // const contract = new ethers.Contract(
    //   contractAddress,
    //   TokenAbi,
    //   relayerAddress
    // );

    // const balance = await contract.balanceOf(address.toLowerCase());

    // const result = balance > 0;

    const result = true;

    return NextResponse.json(
      {
        error: {
          code: 0,
          message: "",
        },
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
          code: 1,
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
