"use client";

import lstStakingAbi from "@/app/libraries/LPStakingABI.json";
import { Context } from "@/app/providers/Providers";
import { Spinner } from "@nextui-org/react";

import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";

export default function LPStaking() {
  const { userAddress, setLoading, loading } = useContext(Context);

  const [totalTachyLP, setTotalTachyLP] = useState(0);
  const [userLP, setUserLP] = useState(0);

  const fetchUserTokens = async () => {
    if (!userAddress) {
      return;
    }

    try {
      setLoading(true);
      const node = "https://node.mainnet.etherlink.com";
      const provider = new ethers.JsonRpcProvider(node);
      const tachyLP = new ethers.Contract(
        "0xC6D0AafDe70058EDA2E4F3DD17200dabD350A8D5",
        lstStakingAbi,
        provider
      );
      const totalSupply = await tachyLP.totalSupply();
      setTotalTachyLP(ethers.formatEther(totalSupply));
      console.log("totalSupply//", totalSupply);
      const balanceOf = await tachyLP.balanceOf(userAddress);
      console.log("balanceOf//", balanceOf);
      setUserLP(ethers.formatEther(balanceOf));
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTokens();
  }, [userAddress]);

  return (
    <div className="grid w-full p-8">
      <div>{totalTachyLP}</div>
      <div>{userLP}</div>
      <div>{loading && <Spinner />}</div>
    </div>
  );
}
