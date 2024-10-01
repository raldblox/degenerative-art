"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ethers } from "ethers";
import { SessionProvider, useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import moodArtABI from "@/libraries/abis/MOODART.json";

export const Context = createContext();

export const Providers = (props) => {
  const [walletSigner, setWalletSigner] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [selectedHomeTab, setSelectedHomeTab] = useState("social");
  const [selectedNetwork, setSelectedNetwork] = useState(new Set([]));
  const [selectedChain, setSelectedChain] = useState({});
  const [hasToken, setHasToken] = useState(false);

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

  useEffect(() => {
    fetch("/api/core/hasToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: "0x0000704b5427D1BE19059Ee68BAdb88935E6079a",
      }),
    })
      .then((response) => {
        console.log("Response status:", response.status); // Check the status code here
        if (!response.ok) {
          // Check if the response is not OK (status code is not in the range 200-299)
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response data:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
  };

  return (
    <NextUIProvider>
      <Context.Provider value={value}>
        <SessionProvider>{props.children}</SessionProvider>
      </Context.Provider>
    </NextUIProvider>
  );
};
