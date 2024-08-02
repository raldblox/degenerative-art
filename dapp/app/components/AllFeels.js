"use client";

import React, { useContext, useEffect, useState } from "react";
import nftAbi from "@/app/libraries/DegenerativeArtABI.json";
import { AssetLoader } from "./AssetLoader";
import { Link } from "@nextui-org/react";
import EmojisContainer from "./EmojisContainer";
import { Context } from "../providers/Providers";
import { ethers } from "ethers";

const AllFeels = () => {
  const { instance, userAddress } = useContext(Context);
  const [allAssets, setAllAssets] = useState(null);
  const [userTokens, setUserTokens] = useState(null);
  const [fetching, setFetching] = useState(false);

  const fetchTokens = async () => {
    try {
      setFetching(true);
      const node = "https://node.mainnet.etherlink.com";
      const provider = new ethers.JsonRpcProvider(node);
      const nftContract = new ethers.Contract(
        "0xcf552524772605de32dae649f7ced60a286b0d21",
        nftAbi,
        provider
      );
      const totalSupply = await nftContract.totalSupply();
      console.log("totalSupply///", totalSupply);

      // Create an array of promises for each token's data fetching
      const tokenDataPromises = Array.from(
        { length: Number(totalSupply) },
        (_, tokenId) =>
          Promise.all([
            nftContract.ownerOf(tokenId),
            nftContract.tokenURI(tokenId),
            nftContract.getEmojis(tokenId),
          ])
      );

      // Wait for all promises to resolve in parallel
      const tokenData = await Promise.all(tokenDataPromises);

      const allAssetsData = tokenData.map(
        ([owner, tokenURI, emojis], tokenId) => ({
          tokenId: tokenId.toString(),
          owner,
          metadata: JSON.parse(atob(tokenURI?.split(",")[1])),
          emojis,
        })
      );

      setAllAssets(allAssetsData);

      if (userAddress) {
        const userTokensData = allAssetsData.filter(
          (asset) => asset.owner.toLowerCase() === userAddress?.toLowerCase()
        );
        setUserTokens(userTokensData);
      }

      console.log("All Assets:", allAssetsData);
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, [instance]);

  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {fetching ? (
        <>
          <AssetLoader />
          <AssetLoader />
          <AssetLoader />
          <AssetLoader />
          <AssetLoader />
          <AssetLoader />
          <AssetLoader />
          <AssetLoader />
          <AssetLoader />
        </>
      ) : (
        <>
          {allAssets?.map((token) => (
            <Link
              href={`/id/${token.tokenId}`}
              key={token.tokenId}
              className="flex flex-col items-center justify-center p-2 duration-200 border-2 border-white shadow-md bg-default-100 hover:shadow rounded-3xl"
            >
              <div className="p-6 duration-300 bg-white group-hover:shadow rounded-2xl">
                <EmojisContainer token={token} />
              </div>
              <div className="flex flex-col items-start justify-between w-full px-2 pt-3 pb-1 text-xs text-black">
                <div className="flex items-center justify-between w-full font-semibold">
                  <p>degeneratives.art #{token.tokenId}</p>
                  <p>{token?.network}</p>
                </div>
                <div className="">
                  <p>
                    {token.owner.slice(0, 5)}
                    ...
                    {token.owner.slice(-4)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </>
      )}
    </ul>
  );
};

export default AllFeels;
