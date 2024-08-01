"use client";

import * as React from "react";

import { NextUIProvider } from "@nextui-org/react";
import { ethers } from "ethers";
import nftAbi from "@/app/libraries/DegenerativeArtABI.json";
import erc20Abi from "@/app/libraries/ERC20TokenABI.json";

export const Context = React.createContext();

export const Providers = (props) => {
  const [signer, setSigner] = React.useState(null);
  const [userAddress, setUserAddress] = React.useState(null);
  const [instance, setInstance] = React.useState({ nft: "", mood: "" });
  const [totalSupply, setTotalSupply] = React.useState(0);
  const [mintPrice, setMintPrice] = React.useState(0);
  const [balances, setBalances] = React.useState({ nft: 0, mood: 0 });
  const [fetching, setFetching] = React.useState(false);

  const [timeUpdated, setTimeUpdated] = React.useState(0);
  const [countdown, setCountdown] = React.useState("00:00:00");

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

        ethereum.on("chainChanged", handleChainChanged);
        function handleChainChanged() {
          window.location.reload();
        }
      } catch (error) {
        console.error(`Error connecting to wallet`, error);
      }
    }
  };

  const switchNetwork = async (value) => {
    if (!userAddress) {
      await connectEthereumWallet();
    }

    const chainId = 42793;
    const correctedChainId = `0x${chainId.toString(16)}`;

    const etherlink = {
      chainId: correctedChainId,
      chainName: "Etherlink Mainnet",
      rpcUrls: ["https://node.mainnet.etherlink.com"],
      nativeCurrency: {
        name: "XTZ",
        symbol: "XTZ",
        decimals: 18,
      },
      blockExplorerUrls: ["https://etherlink.blockscout.com"],
    };

    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: correctedChainId }],
        });
        return chainId;
      } catch (error) {
        if (error.code === 4902) {
          try {
            console.log("Adding new network:", correctedSelectedChain);
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [etherlink],
            });
          } catch (error) {
            console.error("Error adding network:", error);
          }
        } else {
          console.error("Error switching network:", error);
        }
      }
    } else {
      console.error("Error:", error);
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

        const lastUpdateTime = await nftContract.getLastMoodUpdate(userAddress);
        console.log("Cooldown:", lastUpdateTime);
        setTimeUpdated(Number(lastUpdateTime));
      }
    } catch (error) {
      console.warn("Fetching error");
    } finally {
      setFetching(false);
    }
  };

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const cooldownTime = 4 * 60 * 60; // 4 hours cooldown in seconds
      const endCooldownTime = timeUpdated + cooldownTime;
      const timeLeft = Math.max(0, endCooldownTime - now);
      const hours = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(
        2,
        "0"
      );
      const seconds = String(timeLeft % 60).padStart(2, "0");

      setCountdown(`${hours}:${minutes}:${seconds}`);
    };
    calculateTimeLeft();
    const intervalId = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(intervalId);
  }, [timeUpdated, countdown]);

  React.useEffect(() => {
    connectEthereumWallet();
    fetchToken();
    if (userAddress) {
      switchNetwork();
    }
  }, [userAddress]);

  const value = {
    connectEthereumWallet,
    signer,
    userAddress,
    instance,
    totalSupply,
    mintPrice,
    balances,
    fetching,
    switchNetwork,
    countdown,
    timeUpdated,
  };

  return (
    <NextUIProvider>
      <Context.Provider value={value}>{props.children}</Context.Provider>
    </NextUIProvider>
  );
};
