"use client";

import { FeelnCard } from "@/components/sections/FeelnCard";
import { networks } from "@/libraries/network";
import { Context } from "@/providers/Providers";
import { Spinner } from "@nextui-org/react";
import { ethers } from "ethers";
import { useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

export default function Token({ params }) {
  const tokenId = params.tokenId;
  const searchParams = useSearchParams();
  const { setSelectedNetwork, moodArtABI } = useContext(Context);

  const [mounted, setMounted] = useState(false);
  const [tokenNetwork, setTokenNetwork] = useState({});
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState({});

  if (!mounted) {
    const network = searchParams.get("network");

    if (network) {
      const foundNetwork = networks.find(
        (n) => n.chainName.toLowerCase() === network.toLowerCase()
      );
      if (foundNetwork) {
        setTokenNetwork(foundNetwork);
        try {
          setLoading(true);
          // fetch
        } catch (error) {
          console.warn(`Failed to fetch tokenId#${tokenId} (${network})`);
        } finally {
          setLoading(true);
        }
      } else {
        console.error("Network not found:", network);
      }
    }

    setMounted(true);
  }

  useEffect(() => {
    const getTokenData = async () => {
      if (!tokenNetwork) return; // Do nothing if tokenNetwork is not set

      try {
        setLoading(true);
        const provider = new ethers.JsonRpcProvider(tokenNetwork.rpcUrls[0]); // Use rpcUrls
        const contract = new ethers.Contract(
          tokenNetwork.contracts?.moodArt,
          moodArtABI,
          provider
        );

        const [emojis, owner] = await Promise.all([
          contract.getMood(tokenId),
          contract.ownerOf(tokenId),
        ]);

        setTokenData({
          chainName: tokenNetwork.chainName,
          tokenId: tokenId,
          owner: owner,
          emojis: emojis,
        });
        console.log({
          chainName: tokenNetwork.chainName,
          tokenId: tokenId,
          owner: owner,
          emojis: emojis,
        });
      } catch (error) {
        console.warn(
          `Failed to fetch tokenId#${tokenId} (${tokenNetwork.chainName})`
        );
      } finally {
        setLoading(false); // Set loading to false after fetching, even if there's an error
      }
    };

    getTokenData(); // Call getTokenData when tokenNetwork changes
  }, [tokenNetwork, tokenId, moodArtABI]); // Include moodArtABI in the dependency array

  return (
    <div className="flex items-center justify-center p-6 min-h-[calc(100vh-170px)]">
      {loading ? (
        <div>
          <Spinner />
        </div> // Show loading indicator
      ) : tokenData ? (
        <div className="w-full max-w-2xl">
          <FeelnCard post={tokenData} />
        </div>
      ) : (
        <div>Token not found.</div> // Show message if tokenData is null
      )}
    </div>
  );
}
