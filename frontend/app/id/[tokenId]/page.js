"use client";

import { networks } from "@/libraries/network";
import { Context } from "@/providers/Providers";
import { useSearchParams } from "next/navigation";
import React, { useContext, useState } from "react";

export default function Token({ params }) {
  const tokenId = params.tokenId;
  const searchParams = useSearchParams();
  const { setSelectedNetwork } = useContext(Context);

  const [mounted, setMounted] = useState(false);
  const [tokenNetwork, setTokenNetwork] = useState({});
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="grid min-h-screen grid-cols-2 p-6">
      {tokenId} - {tokenNetwork.chainName}
    </div>
  );
}
