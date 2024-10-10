"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ethers } from "ethers";
import { SessionProvider, useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import moodArtABI from "@/libraries/abis/MOODART.json";
import { networks } from "@/libraries/network";

export const Context = createContext();

export const Providers = (props) => {
  const [walletSigner, setWalletSigner] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [selectedHomeTab, setSelectedHomeTab] = useState("nft");
  const [selectedNetwork, setSelectedNetwork] = useState(new Set([]));
  const [selectedChain, setSelectedChain] = useState({});
  const [selectedNavTab, setSelectedNavTab] = useState("dashboard");
  const [totalSupplies, setTotaSupplies] = useState({});

  // instances
  const [providers, setProviders] = useState([]);
  const [instances, setInstances] = useState([]);

  const [randomFeels, setRandomFeels] = useState(new Map([]));

  const connectEthereumWallet = async () => {
    console.log("Connecting to Ethereum Provider...");

    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = await provider.getSigner();
        const user = await signer.getAddress();
        console.log("Connected to Browser's Wallet...");
        setWalletSigner(signer);
        setConnectedAccount(user);

        // Add 'accountsChanged' event listener
        ethereum.on("accountsChanged", handleAccountsChanged);
        function handleAccountsChanged() {
          window.location.reload();
        }

        // Existing 'chainChanged' event listener
        // ethereum.on("chainChanged", handleChainChanged);
        // function handleChainChanged() {
        //   window.location.reload();
        // }
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
            address: "0xd08B30c1EdA1284cD70E73F29ba27B5315aCc3F9",
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

  const fetch = async () => {
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

    const contracts = networks
      .filter((network) => network.isLive)
      .map(
        (network, index) =>
          new ethers.Contract(
            network.contracts?.moodArt,
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
    setTotaSupplies(totalSupplies);
  };

  const [fetching, setFetching] = useState(false);

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
        console.log("liveNetworkUrls", liveNetworkUrls);
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

        const filteredSupplies = totalSupplies.slice(1);
        const filteredInstances = instances.slice(1);
        const feels = await Promise.all(
          filteredSupplies.map(async (supplyData, index) => {
            const contract = filteredInstances[index];
            const totalSupply = parseInt(supplyData.value);

            // Generate 10 random valid indices for each chain
            const randomIndices = [];
            for (let i = 0; i < 5; i++) {
              let randomIndex = Math.floor(Math.random() * totalSupply);
              randomIndices.push(randomIndex);
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
            return tokensData.filter((tokenData) => tokenData !== null); // Remove any null values
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

        if (randomFeels.size === 0) {
          setRandomFeels(
            new Map(flattenedFeels.map((feel, index) => [index, feel]))
          );
        }
        setFetching(false);
      } else {
        fetch();
      }
    } catch (error) {
      console.error("Error in getFeels:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetch();
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
    walletSigner,
    selectedChain,
    setSelectedChain,
    selectedNavTab,
    setSelectedNavTab,
    addToken,
    totalSupplies,
    setTotaSupplies,
    providers,
    setProviders,
    instances,
    setInstances,
    randomFeels,
    setRandomFeels,
    moodArtABI,
    fetch,
    fetching,
    setFetching,
    getFeels,
  };

  return (
    <NextUIProvider>
      <Context.Provider value={value}>
        <SessionProvider>{props.children}</SessionProvider>
      </Context.Provider>
    </NextUIProvider>
  );
};
