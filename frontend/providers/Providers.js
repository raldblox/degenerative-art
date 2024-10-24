"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ethers } from "ethers";
import { SessionProvider } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import moodArtABI from "@/libraries/abis/MOODART.json";
import wrappedERC0ABI from "@/libraries/abis/WRAPPEDERC20.json";
import bridgeABI from "@/libraries/abis/BRIDGE.json";
import { networks } from "@/libraries/network";

export const Context = createContext();

export const Providers = (props) => {
  const [walletSigner, setWalletSigner] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [selectedHomeTab, setSelectedHomeTab] = useState("nft");
  const [selectedNetwork, setSelectedNetwork] = useState("42793");
  const [selectedChain, setSelectedChain] = useState({});
  const [selectedNavTab, setSelectedNavTab] = useState("home");
  const [totalSupplies, setTotalSupplies] = useState({});
  const [tokenBalances, setTokenBalances] = useState({});
  const [nftBalances, setNFTBalances] = useState([]);
  const [showMintModal, setShowMintModal] = useState(false);

  // instances
  const [providers, setProviders] = useState([]);
  const [instances, setInstances] = useState([]);

  const [randomFeels, setRandomFeels] = useState(new Map([]));
  const [usedIndices, setUsedIndices] = useState([]);

  const [fetching, setFetching] = useState(false);

  const endpoint =
    process.env.NEXT_PUBLIC_NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://degeneratives.art";

  const hexalanaEndpoint = `${endpoint}/api/hexalana/`;
  const moodEndpoint = `${endpoint}/api/mood/`;

  const connectEthereumWallet = async () => {
    console.log("Connecting to Ethereum Provider...");

    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const user = await signer.getAddress();
        setWalletSigner(signer);
        setConnectedAccount(user);
        localStorage.setItem("lastWalletConnection", Date.now().toString());
        console.log("Connected to Browser's Wallet...");
      } catch (error) {
        console.error(`Error connecting to wallet`, error);
      }
    } else {
      // alert("Metamask not found.");
    }
  };

  const addToken = async () => {
    if (window.ethereum) {
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: selectedChain?.contracts?.MOOD,
            symbol: "MOOD",
            decimals: "18",
            image: "https://degeneratives.art/icon_wht.png",
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    }
  };

  const getSupplies = async () => {
    const getLiveNetworks = () => {
      return networks
        .filter((network) => network.isLive)
        .map((network) => network.rpcUrls[0]);
    };

    const liveNetworkUrls = getLiveNetworks();
    console.log("liveNetworkUrls", liveNetworkUrls);
    const providers = liveNetworkUrls.map(
      (rpcUrl) => new ethers.JsonRpcProvider(rpcUrl)
    );

    setProviders(providers);

    const contracts = networks
      .filter((network) => network.isLive)
      .map(
        (network, index) =>
          new ethers.Contract(
            network?.contracts?.moodArt,
            moodArtABI,
            providers[index]
          )
      );

    const supplies = contracts.map((contract, index) =>
      contract
        .totalSupply()
        .catch(() => {
          return 0;
        })
        .then((totalSupply) => ({
          name: networks[index].chainName,
          value: Number(totalSupply),
        }))
    );

    const totalSupplies = await Promise.all(supplies);
    console.log("totalSupplies", totalSupplies);
    setTotalSupplies(totalSupplies);

    if (connectedAccount) {
      const userBalances = contracts.map((contract, index) =>
        contract
          .balanceOf(connectedAccount)
          .catch(() => {
            return 0;
          })
          .then((totalSupply) => ({
            name: networks[index].chainName,
            value: Number(totalSupply),
          }))
      );
      const results = await Promise.all(userBalances);
      console.log("nftBalances", results);
      setNFTBalances(results);
    }
  };

  const getFeels = async () => {
    try {
      setFetching(true);
      if (totalSupplies.length > 0) {
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

        const feels = await Promise.all(
          totalSupplies.map(async (supplyData, index) => {
            const contract = instances[index];
            const totalSupply = parseInt(supplyData.value);

            // Initialize usedIndices for the current chain if it doesn't exist
            if (!usedIndices[index]) {
              usedIndices[index] = [];
            }

            // Generate random indices, excluding usedIndices, within the range of totalSupply
            const randomIndices = [];
            while (
              randomIndices.length < 5 &&
              usedIndices[index].length < totalSupply
            ) {
              let randomIndex = Math.floor(Math.random() * totalSupply);
              if (!usedIndices[index].includes(randomIndex)) {
                randomIndices.push(randomIndex);
                usedIndices[index].push(randomIndex);
              }
            }

            // If no new random indices can be generated, skip fetching for this chain
            if (randomIndices.length === 0) {
              return [];
            }

            // Fetch token data for the random indices
            const tokenPromises = randomIndices.map(async (randomIndex) => {
              try {
                const tokenId = await contract.tokenByIndex(
                  Number(randomIndex)
                );

                const [emojis, owner] = await Promise.all([
                  contract.getMood(tokenId),
                  contract.ownerOf(tokenId),
                ]);
                return {
                  chainName: supplyData.name,
                  tokenId: tokenId,
                  owner: owner,
                  emojis: emojis,
                };
              } catch (error) {
                return null;
              }
            });

            const tokensData = await Promise.all(tokenPromises);
            return tokensData.filter((tokenData) => tokenData !== null);
          })
        );

        // Flatten the feels array and update state
        let flattenedFeels;
        flattenedFeels = feels.flat();
        for (let i = flattenedFeels.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [flattenedFeels[i], flattenedFeels[j]] = [
            flattenedFeels[j],
            flattenedFeels[i],
          ];
        }

        setRandomFeels((prevFeels) => {
          const updatedFeels = new Map(prevFeels); // Create a copy of the map
          flattenedFeels.forEach((feel, index) => {
            updatedFeels.set(prevFeels.size + index, feel); // Add new feels with unique keys
          });
          return updatedFeels;
        });

        setUsedIndices(usedIndices); // Update usedIndices state
        setFetching(false);
      } else {
        getSupplies();
      }
    } catch (error) {
      console.error("Error in getFeels:", error);
    } finally {
      setFetching(false);
    }
  };

  const getBalances = async () => {
    if (!connectedAccount) {
      return;
    }

    const bridgeNetworks = networks.filter((network) => network.hasBridge);
    const providers = bridgeNetworks.map(
      (network) => new ethers.JsonRpcProvider(network.rpcUrls[0])
    );

    const contracts = bridgeNetworks.map(
      (network, index) =>
        new ethers.Contract(
          network?.contracts?.wrappedMOOD,
          wrappedERC20ABI,
          providers[index]
        )
    );

    const balances = await Promise.all(
      contracts.map((contract, index) =>
        contract
          .balanceOf(connectedAccount)
          .catch(() => 0)
          .then((balance) => ({
            name: bridgeNetworks[index].chainName, // Use bridgeNetworks here
            value: Number(balance),
          }))
      )
    );

    console.log("tokenBalances", balances);
    setTokenBalances(balances);
  };

  useEffect(() => {
    const lastConnectionTimestamp = localStorage.getItem(
      "lastWalletConnection"
    );
    if (
      lastConnectionTimestamp &&
      Date.now() - parseInt(lastConnectionTimestamp) < 60 * 60 * 1000
    ) {
      connectEthereumWallet();
    }
  }, []);

  useEffect(() => {
    getSupplies();
  }, []);

  useEffect(() => {
    getFeels();
  }, [totalSupplies]);

  const value = {
    selectedHomeTab,
    setSelectedHomeTab,
    selectedNetwork,
    setSelectedNetwork,
    moodArtABI,
    connectEthereumWallet,
    connectedAccount,
    setConnectedAccount,
    walletSigner,
    selectedChain,
    setSelectedChain,
    selectedNavTab,
    setSelectedNavTab,
    addToken,
    totalSupplies,
    setTotalSupplies,
    providers,
    setProviders,
    instances,
    setInstances,
    randomFeels,
    setRandomFeels,
    moodArtABI,
    getSupplies,
    fetching,
    setFetching,
    getFeels,
    bridgeABI,
    wrappedERC0ABI,
    hexalanaEndpoint,
    moodEndpoint,
    showMintModal,
    setShowMintModal,
  };

  return (
    <NextUIProvider>
      <Context.Provider value={value}>
        <SessionProvider>{props.children}</SessionProvider>
      </Context.Provider>
    </NextUIProvider>
  );
};
