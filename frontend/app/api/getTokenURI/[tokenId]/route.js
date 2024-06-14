const { NextRequest, NextResponse } = require("next/server");
const { ethers } = require("ethers");
import { Network, Alchemy } from "alchemy-sdk";
import degenArtAbi from "@/app/(libraries)/DegenerativesArt.json";

const CONTRACT_ADDRESS = "0xDD9B9311Df9bea81a8640C650981393544311F23"; // Your actual contract address

export const runtime = "edge";

async function fetchTokenURI(tokenId) {
  try {
    const node = process.env.ALCHEMY_WSS_AMOY;
    const provider = new ethers.WebSocketProvider(node);
    let contract = new ethers.Contract(CONTRACT_ADDRESS, degenArtAbi, provider);
    let tokenURI = await contract.tokenURI(tokenId);
    let owner = await contract.ownerOf(tokenId);
    const metadata = JSON.parse(atob(tokenURI?.split(",")[1]));
    return [owner, metadata];
  } catch (error) {
    console.error("Error fetching tokenURI:", error);
    throw new Error("Failed to fetch tokenURI");
  }
}

export async function GET(request, { params }) {
  try {
    const [owner, tokenURI] = await fetchTokenURI(params.tokenId);
    return NextResponse.json({ tokenId: params.tokenId, owner, tokenURI });
  } catch (error) {
    console.error("Error in API route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
