const { NextRequest, NextResponse } = require("next/server");
const { ethers } = require("ethers");
import degenArtAbi from "@/app/(libraries)/DegenerativesArt.json";
import { contractDeployments } from "@/app/(libraries)/deployments";

export const runtime = "edge";

async function fetchSupplyByNetwork(network) {
  try {
    const node = contractDeployments[network]?.network?.rpcUrls[0];
    if (!node) {
      throw new Error(`RPC url not found for network: ${network}`);
    }
    console.log("rpc", node);
    const provider = new ethers.JsonRpcProvider(node);
    const contractAddress =
      contractDeployments[network]?.DegenerativesArt?.address;
    const contract = new ethers.Contract(
      contractAddress,
      degenArtAbi,
      provider
    );
    const supply = await contract.totalSupply();
    return { network, supply: supply.toString() };
  } catch (error) {
    console.error("Error fetching supply for network:", network, error);
    return { network, error }; // Indicate error for specific network
  }
}

export async function GET(request, { params }) {
  try {
    const networks = [
      "polygon",
      "core",
      "etherlink",
      "polygonAmoy",
      "coreTestnet",
      "etherlinkTestnet",
    ];
    const promises = networks.map((network) => fetchSupplyByNetwork(network));
    const results = await Promise.all(promises);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error in API route:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
