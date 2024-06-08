const { NextRequest, NextResponse } = require("next/server");
const { ethers } = require("ethers");
import { Network, Alchemy } from "alchemy-sdk";
import degenArtAbi from "@/app/(libraries)/DegenerativesArt.json";

const CONTRACT_ADDRESS = "0x79f3557b73f89df0e54a6d5b71d63fd098ed6af4"; // Your actual contract address

export const runtime = "edge";

async function fetchTokenURI(tokenId) {
  try {
    const node = process.env.ALCHEMY_WSS_AMOY; // api
    const provider = new ethers.WebSocketProvider(node);
    let contract = new ethers.Contract(CONTRACT_ADDRESS, degenArtAbi, provider);
    let tokenURI = await contract.tokenURI(tokenId);
    const metadata = JSON.parse(atob(tokenURI?.split(",")[1]));
    return metadata;
  } catch (error) {
    console.error("Error fetching tokenURI:", error);
    throw new Error("Failed to fetch tokenURI");
  }
}

export async function GET(request, { params }) {
  try {
    const tokenURI = await fetchTokenURI(params.tokenId);
    const data = tokenURI.image;
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in API route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
