"use client";

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ethers } from "ethers";
import { NextUIProvider } from "@nextui-org/react";
import degenArtAbi from "../(libraries)/DegenerativesArt.json";
import erc20Abi from "../(libraries)/MoodToken.json";
import pricerAbi from "../(libraries)/Pricer.json";
import { contractDeployments } from "../(libraries)/deployments";

export const Context = createContext();

export const EthereumProvider = (props) => {
  const [userAddress, setUserAddress] = useState(null);
  const [userBalance, setUserBalance] = useState("");
  const [instances, setInstances] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [network, setNetwork] = useState("");
  const [userTokens, setUserTokens] = useState([]);
  const [allAssets, setAllAssets] = useState([]);
  const [timeUpdated, setTimeUpdated] = useState(0);
  const [countdown, setCountdown] = useState("00:00:00");
  const [collection, setCollection] = useState({ totalSupply: 0 });

  const [minting, setMinting] = useState(false);
  const [fetching, setFetching] = useState(true);

  const supportedNetworks = ["polygonAmoy", "polygon", "etherlink"];

  const initializeProvider = async () => {
    let provider_;
    let signer_ = null;
    if (window.ethereum == null) {
      console.log("MetaMask not installed");
      const node = contractDeployments[supportedNetworks[0]].network.rpcUrls[0];
      provider_ = new ethers.JsonRpcProvider(node);
      console.log("Connected to: ", node);
      return { provider_, signer_ };
    } else {
      provider_ = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      signer_ = await provider_.getSigner();
      console.log("Connected to Browser's Wallet...");
      return { provider_, signer_ };
    }
  };

  const switchNetwork = async () => {
    if (window.ethereum && network) {
      const currentNetwork = contractDeployments[network];
      const chainIdHex = `0x${currentNetwork.network.chainId.toString(16)}`;
      const currentChainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      if (currentChainId !== chainIdHex) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainIdHex }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: chainIdHex,
                    rpcUrls: currentNetwork.network.rpcUrls,
                    chainName: currentNetwork.network.chainName,
                    nativeCurrency: currentNetwork.network.nativeCurrency,
                    blockExplorerUrls: currentNetwork.network.blockExplorerUrls,
                  },
                ],
              });
              await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: chainIdHex }],
              });
            } catch (addError) {
              console.error("Error adding network:", addError);
            }
          } else {
            console.error("Error switching network:", switchError);
          }
        }
      }
    }
  };

  const initializeContract = async (provider_, signer_) => {
    if (!network) {
      console.error("No network");
      return;
    }
    const currentNetwork = contractDeployments[network];

    let signerOrProvider = provider_;
    if (window.ethereum) {
      signerOrProvider = signer_;
    }

    const degenerativesArtInstance = new ethers.Contract(
      currentNetwork.DegenerativesArt.address,
      degenArtAbi,
      signerOrProvider
    );
    setInstances({ DegenerativesArt: degenerativesArtInstance });
    return degenerativesArtInstance;
  };

  const fetchCollectionData = async (contract) => {
    try {
      const totalSupply = await contract.totalSupply();
      setCollection({ totalSupply: Number(totalSupply) });
      console.log("Total Supply:", totalSupply.toString());
    } catch (error) {
      console.error("Failed to get total supply:", error);
    } finally {
    }
  };

  const connectEthereumProvider = useCallback(async () => {
    console.log("Connecting to Ethereum Provider...");
    try {
      const { provider_, signer_ } = await initializeProvider();
      setProvider(provider_);
      if (signer_ !== null) {
        setSigner(signer_);
        const userAddr = await signer_.getAddress();
        console.log("User address: ", userAddr);
        setUserAddress(userAddr);
      }

      await switchNetwork();
      if (!network) {
        setNetwork("polygonAmoy");
        return;
      }

      const degenerativesArtInstance = await initializeContract(
        provider_,
        signer_
      );
      if (degenerativesArtInstance) {
        await fetchCollectionData(degenerativesArtInstance);
      }
    } catch (error) {
      console.error("Failed to connect to Ethereum provider:", error);
    }
  }, [network, userAddress]);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const currentChainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          const supportedNetwork = Object.keys(contractDeployments).find(
            (key) =>
              `0x${contractDeployments[key].network.chainId.toString(16)}` ===
              currentChainId
          );
          if (supportedNetwork) {
            setNetwork(supportedNetwork);
            await connectEthereumProvider();
          } else {
            console.error("Network not supported");
          }
        } catch (error) {
          console.error("Failed to get current network:", error);
        }
      } else {
        console.log("Ethereum object not found");
        const { provider_ } = await initializeProvider();
        setProvider(provider_);
        await connectEthereumProvider();
      }
    };
    init();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, [connectEthereumProvider]);

  const fetchTokens = useCallback(async () => {
    if (!instances?.DegenerativesArt) return;
    setFetching(true);

    try {
      const totalSupply = await instances.DegenerativesArt.totalSupply();
      const allAssetsData = [];
      const userTokensData = [];

      for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
        const owner = await instances.DegenerativesArt.ownerOf(tokenId);
        const tokenURI = await instances.DegenerativesArt.tokenURI(tokenId);
        const emojis = await instances.DegenerativesArt.getEmojis(tokenId);
        const metadata = JSON.parse(atob(tokenURI?.split(",")[1]));
        const network_ = network;

        allAssetsData.push({
          tokenId: tokenId.toString(),
          owner,
          metadata,
          emojis,
          network: network_,
        });

        if (owner.toLowerCase() === userAddress?.toLowerCase()) {
          userTokensData.push({
            tokenId: tokenId.toString(),
            owner,
            metadata,
            emojis,
            network: network_,
          });
        }
      }

      setAllAssets(allAssetsData);
      setUserTokens(userTokensData);

      console.log("All Assets:", allAssetsData);
      console.log("User Tokens:", userTokensData);
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
    } finally {
      setFetching(false);
    }
  }, [instances?.DegenerativesArt, userAddress]);

  const getTimeLastUpdate = useCallback(async () => {
    if (userAddress && instances?.DegenerativesArt) {
      try {
        const lastUpdateTime = await instances?.DegenerativesArt.getLastMoodUpdate(
          userAddress
        );
        console.log("Cooldown:", lastUpdateTime);
        setTimeUpdated(Number(lastUpdateTime));
      } catch (error) {
        console.error("Failed to get last update time:", error);
      }
    }
  }, [instances?.DegenerativesArt, userAddress]);

  // write function

  const updateEmoji = useCallback(
    async (tokenId, newEmojis) => {
      if (!instances?.DegenerativesArt || !userAddress) return;
      console.log("updating:", tokenId, newEmojis);

      const nftAddress = contractDeployments[network].DegenerativesArt.address;
      const moodTokenAddress = contractDeployments[network].MoodToken.address;
      const pricerAddress = contractDeployments[network].NFTPricer.address;
      console.log("address:", moodTokenAddress, pricerAddress);

      try {
        const moodTokenInstance = new ethers.Contract(
          moodTokenAddress,
          erc20Abi,
          signer
        );

        const pricerInstance = new ethers.Contract(
          pricerAddress,
          pricerAbi,
          signer
        );

        const [, requiredAllowance] = await pricerInstance.price(
          tokenId,
          moodTokenAddress
        );
        console.log("requiredAllowance:", requiredAllowance);

        const allowance = await moodTokenInstance.allowance(
          userAddress,
          nftAddress
        );
        console.log("allowance:", allowance);

        if (allowance < requiredAllowance) {
          const tx = await moodTokenInstance.approve(
            nftAddress,
            requiredAllowance
          );
          console.log("Approval transaction sent.");
          await tx.wait();
        }

        const updateTx = await instances.DegenerativesArt.update(
          tokenId,
          newEmojis,
          pricerAddress,
          moodTokenAddress
        );

        await updateTx.wait();
        console.log("Emoji updated successfully.");
      } catch (error) {
        console.error("Failed to update emoji:", error);
      }
    },
    [instances?.DegenerativesArt, userAddress, signer, network]
  );

  const mint = async (inputValues) => {
    if (!instances?.DegenerativesArt || !userAddress) return;

    setMinting(true);
    console.log("emojis:", inputValues);
    try {
      console.log("emojis:", inputValues);
      const tokenId = await instances.DegenerativesArt.totalSupply();
      const price = await instances.DegenerativesArt.price(tokenId);

      // Log transaction details
      console.log("Minting transaction details:");
      console.log("Token ID:", tokenId.toString());
      console.log("Price:", price.toString());
      console.log("User Address:", userAddress);

      // Send transaction
      const tx = await instances.DegenerativesArt.mint(inputValues, {
        value: price,
      });
      await tx.wait();

      console.log("Minting successful!");
      setMinted(true);
    } catch (error) {
      // Log error details
      console.error("Minting failed:", error);

      // Handle specific errors
      if (error.code === -32603) {
        console.error(
          "Internal JSON-RPC error. Check the parameters and try again."
        );
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        console.error(
          "Insufficient funds for gas or value. Please ensure your wallet has enough balance."
        );
      } else if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
        console.error(
          "The gas limit could not be estimated. Try setting a higher gas limit manually."
        );
      } else {
        console.error("An unknown error occurred:", error.message);
      }
    } finally {
      setMinting(false);
    }
  };

  useEffect(() => {
    getTimeLastUpdate();
  }, [getTimeLastUpdate]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  useEffect(() => {
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

  const value = {
    signer,
    provider,
    userAddress,
    userBalance,
    connectEthereumProvider,
    collection,
    userTokens,
    allAssets,
    updateEmoji,
    countdown,
    timeUpdated,
    setNetwork,
    network,
    mint,
    minting,
    fetching,
  };

  return (
    <NextUIProvider>
      <Context.Provider value={value}>{props.children}</Context.Provider>
    </NextUIProvider>
  );
};
