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
          return contract.totalSupply();
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

  useEffect(() => {
    fetch();
  }, []);

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
  };

  return (
    <NextUIProvider>
      <Context.Provider value={value}>
        <SessionProvider>{props.children}</SessionProvider>
      </Context.Provider>
    </NextUIProvider>
  );
};
