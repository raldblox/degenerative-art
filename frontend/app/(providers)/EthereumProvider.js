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
  const [walletProvider, setWalletProvider] = useState(null);
  const [walletSigner, setWalletSigner] = useState(null);

  const [userAddress, setUserAddress] = useState(null);
  const [userBalance, setUserBalance] = useState("");
  const [network, setNetwork] = useState("");

  const [userTokens, setUserTokens] = useState([]);
  const [allAssets, setAllAssets] = useState([]);
  const [timeUpdated, setTimeUpdated] = useState(0);
  const [countdown, setCountdown] = useState("00:00:00");

  const [collection, setCollection] = useState({ totalSupply: 0 });

  const [minting, setMinting] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [nodeProvider, setNodeProvider] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [instances, setInstances] = useState({});
  const [tokenSupplies, setTokenSupplies] = useState({});

  const supportedNetworks = ["polygonAmoy", "polygon", "etherlink"];

  const initializeNodeProvider = async () => {
    let contractInstances = {};
    for (const networkName of supportedNetworks) {
      // Use for...of loop for cleaner iteration
      const nodeUrl = contractDeployments[networkName].network.rpcUrls[0];

      try {
        const nodeProvider = new ethers.JsonRpcProvider(nodeUrl);
        const block = await nodeProvider.getBlockNumber();
        console.log("Connected to", networkName, "| Block", block);

        setNodeProvider((prev) => ({
          ...prev,
          [networkName]: nodeProvider,
        }));

        if (nodeProvider) {
          const degenerativesArtInstance = new ethers.Contract(
            contractDeployments[networkName].DegenerativesArt.address,
            degenArtAbi,
            nodeProvider
          );

          setInstances((prev) => ({
            ...prev,
            [networkName]: { DegenerativesArt: degenerativesArtInstance },
          }));

          console.log(networkName, "contract instance is set.");

          const totalSupply = await degenerativesArtInstance.totalSupply();
          console.log("totalSupply on", networkName, totalSupply);
          setTokenSupplies((prev) => ({
            ...prev,
            [networkName]: { totalSupply: totalSupply },
          }));
        } else {
          console.error("Wallet not connected. Cannot set contract instance.");
        }
      } catch (error) {
        console.error(`Error connecting to ${networkName}:`, error);
      }
    }
  };

  const fetchAllFeels = async () => {
    for (const networkName of supportedNetworks) {
      const contract = instances[networkName]?.DegenerativesArt;
      if (contract) {
        const totalSupply = await contract.totalSupply();
        console.log(networkName, "totalSupply:", totalSupply);
        setTokenSupplies((prev) => ({
          ...prev,
          [networkName]: { totalSupply },
        }));
      } else {
        console.warn(`Contract instance not found for ${networkName}`);
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        setIsLoading(true);
        await initializeNodeProvider();
        setIsLoading(false);
      } else {
        console.error("MetaMask not detected. Please install and connect.");
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!isLoading && Object.keys(instances).length > 0) {
      const fetchInterval = setInterval(fetchAllFeels, 15000);
      return () => clearInterval(fetchInterval);
    }
  }, [instances, nodeProvider, isLoading]);

  const initializeWalletProvider = async () => {
    if (window.ethereum) {
      try {
        const walletProvider_ = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const walletSigner_ = await walletProvider_.getSigner();
        console.log("Connected to Browser's Wallet...");
        setWalletSigner(walletSigner_);
      } catch (error) {
        console.error(`Error connecting to wallet`, error);
      }
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

  const initializeContract = async () => {
    if (network) {
      await switchNetwork();
      const currentNetwork = contractDeployments[network];
      const degenerativesArtInstance = new ethers.Contract(
        currentNetwork.DegenerativesArt.address,
        degenArtAbi,
        walletProvider
      );

      setInstances({ DegenerativesArt: degenerativesArtInstance });
      return degenerativesArtInstance;
    } else {
      console.error("No network");
    }
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
      if (window.ethereum) {
        await initializeWalletProvider();
        const userAddr = await walletSigner.getAddress();
        console.log("User address: ", userAddr);
        setUserAddress(userAddr);
      }

      const degenerativesArtInstance = await initializeContract();

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
          walletSigner
        );

        const pricerInstance = new ethers.Contract(
          pricerAddress,
          pricerAbi,
          walletSigner
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
    [instances?.DegenerativesArt, userAddress, walletSigner, network]
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
    walletSigner,
    nodeProvider,
    walletProvider,
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
    tokenSupplies,
  };

  return (
    <NextUIProvider>
      <Context.Provider value={value}>{props.children}</Context.Provider>
    </NextUIProvider>
  );
};
