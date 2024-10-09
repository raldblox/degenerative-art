const { NextRequest, NextResponse } = require("next/server");
const { ethers } = require("ethers");
import ERC721 from "@/libraries/abis/ERC721.json";
import { networks } from "@/libraries/network";
import moodArtABI from "@/libraries/abis/MOODART.json";

export const runtime = "edge";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1; // Get page number from query parameter

    const pageSize = 10; // Number of feels to fetch per page

    const getLiveNetworks = () => {
      return networks
        .filter((network) => network.isLive)
        .map((network) => network.rpcUrls[0]);
    };

    const liveNetworkUrls = getLiveNetworks();
    const providers = liveNetworkUrls.map(
      (rpcUrl) => new ethers.JsonRpcProvider(rpcUrl)
    );

    const instances = networks
      .filter((network) => network.isLive)
      .map(
        (network, index) =>
          new ethers.Contract(
            network.contracts?.moodArt,
            moodArtABI,
            providers[index]
          )
      );

    const filteredSupplies = await Promise.all(
      instances.map((instance) => instance.totalSupply())
    );

    const feels = await Promise.all(
      filteredSupplies.map(async (totalSupply, index) => {
        const contract = instances[index];
        const supply = parseInt(totalSupply.toString());

        // Calculate the start and end indices for the current page
        const startIndex = (page - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, supply);

        // Generate random valid indices for the current page
        const randomIndices = [];
        for (let i = startIndex; i < endIndex; i++) {
          let randomIndex = Math.floor(Math.random() * supply);
          randomIndices.push(randomIndex);
        }

        // Fetch token data for the random indices
        const tokenPromises = randomIndices.map(async (randomIndex) => {
          try {
            const tokenId = await contract.tokenByIndex(Number(randomIndex));
            const [emojis, owner] = await Promise.all([
              contract.getMood(tokenId),
              contract.ownerOf(tokenId),
            ]);
            return {
              chainName: networks[index].chainName,
              tokenId: tokenId.toString(),
              owner: owner,
              emojis: emojis,
            };
          } catch (error) {
            console.error("Error fetching token data");
            return null;
          }
        });

        const tokensData = await Promise.all(tokenPromises);
        return tokensData.filter((tokenData) => tokenData !== null);
      })
    );

    const flattenedFeels = feels.flat();

    // Randomize the flattenedFeels array
    for (let i = flattenedFeels.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [flattenedFeels[i], flattenedFeels[j]] = [
        flattenedFeels[j],
        flattenedFeels[i],
      ];
    }

    return NextResponse.json(flattenedFeels);
  } catch (error) {
    console.error("Error in /api/feels:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
