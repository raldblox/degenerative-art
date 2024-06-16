const { NextRequest, NextResponse } = require("next/server");
const { ethers } = require("ethers");
import degenArtAbi from "@/app/(libraries)/DegenerativesArt.json";
import { contractDeployments } from "@/app/(libraries)/deployments";

export const runtime = "edge";

async function fetchTokenURI(tokenId, network) {
  try {
    const node = contractDeployments[network]?.network?.rpcUrls[0];
    console.log("rpc", node);
    const provider = new ethers.JsonRpcProvider(node);
    let contract = new ethers.Contract(
      contractDeployments[network].DegenerativesArt.address,
      degenArtAbi,
      provider
    );
    let tokenURI = await contract.tokenURI(tokenId);
    let owner = await contract.ownerOf(tokenId);
    const metadata = JSON.parse(atob(tokenURI?.split(",")[1]));
    const emojis = await contract.getEmojis(tokenId);
    return [owner, metadata, emojis];
  } catch (error) {
    console.error("Error fetching tokenURI:", error);
    throw new Error("Failed to fetch tokenURI");
  }
}

export async function GET(request, { params }) {
  try {
    console.log("checks", params.tokenId, params.network);
    const [owner, tokenURI, emojis] = await fetchTokenURI(
      params.tokenId,
      params.network
    );
    return NextResponse.json({
      tokenId: params.tokenId,
      owner,
      emojis,
      tokenURI,
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
