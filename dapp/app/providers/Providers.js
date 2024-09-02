"use client";

import { ethers } from "ethers";
import nftAbi from "@/app/libraries/DegenerativeArtABI.json";
import erc20Abi from "@/app/libraries/ERC20TokenABI.json";
import { createContext, useEffect, useState } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export const Context = createContext();

export const Providers = (props) => {
  const [signer, setSigner] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [userNFTs, setUserNFTs] = useState([]);
  const [selectedTab, setSelectedTab] = useState("home");

  const [instance, setInstance] = useState({ nft: "", mood: "" });
  const [totalSupply, setTotalSupply] = useState(0);
  const [mintPrice, setMintPrice] = useState(0);
  const [balances, setBalances] = useState({ nft: 0, mood: 0, eth: 0 });
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);

  const [timeUpdated, setTimeUpdated] = useState(0);
  const [countdown, setCountdown] = useState("00:00:00");
  const [data, setData] = useState([]);

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

        // Add 'accountsChanged' event listener
        ethereum.on("accountsChanged", handleAccountsChanged);
        function handleAccountsChanged() {
          window.location.reload();
        }

        // Existing 'chainChanged' event listener
        ethereum.on("chainChanged", handleChainChanged);
        function handleChainChanged() {
          window.location.reload();
        }
      } catch (error) {
        console.error(`Error connecting to wallet`, error);
      }
    } else {
      // alert("Metamask not found.");
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
        "0x5F440745E21D2F0388F7360586e8d92a9058BccC",
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
      const tokenIds = await nftContract.tokenIds();
      const price = await nftContract.price(tokenIds);
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

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const cooldownTime = 60;
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

  useEffect(() => {
    connectEthereumWallet();
    fetchToken();
    if (userAddress) {
      switchNetwork();
    }

    const intervalId = setInterval(() => {
      fetchToken();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [userAddress]);

  const fetchUserTokens = async () => {
    if (!userAddress) {
      return;
    }

    try {
      setLoading(true);
      const node = "https://node.mainnet.etherlink.com";
      const provider = new ethers.JsonRpcProvider(node);

      // Assuming your DegenerativesArtV3 contract inherits from ERC721Enumerable
      const nftContract = new ethers.Contract(
        "0x5F440745E21D2F0388F7360586e8d92a9058BccC",
        nftAbi,
        provider
      );

      const balanceOf = await nftContract.balanceOf(userAddress);
      console.log("balanceOf///", balanceOf);

      if (balanceOf == 0) {
        return;
      }

      const userTokens = [];

      // Use ERC721Enumerable's tokenOfOwnerByIndex to iterate over owned tokens
      for (let index = 0; index < Number(balanceOf); index++) {
        const tokenId = await nftContract.tokenOfOwnerByIndex(
          userAddress,
          index
        );

        console.log("Fetching//", tokenId);

        // Fetch emojis from the next tokenId if current tokenId is above 1039
        const emojis = await nftContract.getEmojis(
          tokenId > 1039 ? tokenId + 1 : tokenId
        );
        const moodSwing = await nftContract.getMoodSwing(tokenId);
        console.log("emojis//", emojis, moodSwing);

        userTokens.push({
          tokenId: tokenId, // Convert tokenId to string
          owner: userAddress,
          emojis,
          moodSwing: moodSwing.toString(),
        });

        setUserNFTs(userTokens);

        if (userTokens.length === Number(balanceOf)) {
          setLoading(false);
          break;
        }
      }
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTokens();
  }, [userAddress, updated]);

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
    userNFTs,
    setUserNFTs,
    loading,
    setLoading,
    selectedTab,
    setSelectedTab,
    updating,
    setUpdating,
    updated,
    setUpdated,
    data,
    setData,
  };

  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <Context.Provider value={value}>{props.children}</Context.Provider>
      </NextThemesProvider>
    </NextUIProvider>
  );
};
