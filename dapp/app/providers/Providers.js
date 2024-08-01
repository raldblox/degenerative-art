"use client";

import * as React from "react";

import { NextUIProvider } from "@nextui-org/react";
import { ethers } from "ethers";
import nftAbi from "@/app/libraries/DegenerativeArtABI.json";
import erc20Abi from "@/app/libraries/MoodTokenABI.json";

export const Context = React.createContext();

export const Providers = (props) => {
  const [signer, setSigner] = React.useState(null);
  const [userAddress, setUserAddress] = React.useState(null);
  const [instance, setInstance] = React.useState({ nft: "", mood: "" });
  const [totalSupply, setTotalSupply] = React.useState(0);
  const [mintPrice, setMintPrice] = React.useState(0);
  const [balances, setBalances] = React.useState({ nft: 0, mood: 0 });
  const [fetching, setFetching] = React.useState(false);

  const connectEthereumWallet = async () => {
    console.log("Connecting to Ethereum Provider...");

    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = await provider.getSigner();
        const user = await signer.getAddress();
        console.log("Connected to Browser's Wallet...");
        setSigner(signer);
        setUserAddress(user);
      } catch (error) {
        console.error(`Error connecting to wallet`, error);
      }
    }
  };

  const fetchToken = async () => {
    try {
      setFetching(true);
      const node = "https://node.mainnet.etherlink.com";
      const provider = new ethers.JsonRpcProvider(node);
      const nftContract = new ethers.Contract(
        "0xcf552524772605de32dae649f7ced60a286b0d21",
        nftAbi,
        provider
      );
      const moodContract = new ethers.Contract(
        "0xd08b30c1eda1284cd70e73f29ba27b5315acc3f9",
        erc20Abi,
        provider
      );
      setInstance({ mood: moodContract, nft: nftContract });
      const totalSupply = await nftContract.totalSupply();
      const price = await nftContract.price(totalSupply);
      setTotalSupply(totalSupply);
      setMintPrice(price);
      console.log("totalSupply:", totalSupply, price);

      if (userAddress) {
        setBalances({
          nft: await nftContract.balanceOf(userAddress),
          mood: await moodContract.balanceOf(userAddress),
        });
      }
    } catch (error) {
      console.warn("Fetching error");
    } finally {
      setFetching(false);
    }
  };

  React.useEffect(() => {
    fetchToken();
  }, [userAddress]);

  const value = {
    connectEthereumWallet,
    signer,
    userAddress,
    instance,
    totalSupply,
    mintPrice,
    balances,
    fetching
  };

  return (
    <NextUIProvider>
      <Context.Provider value={value}>{props.children}</Context.Provider>
    </NextUIProvider>
  );
};
