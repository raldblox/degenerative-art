"use client";

import React, { createContext, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { MainnetNetworks, TestnetNetworks } from "./Networks";
import { NextUIProvider } from "@nextui-org/react";
import degenArtAbi from "../(libraries)/DegenerativesArt.json";

export const Context = createContext();

export const EthereumProvider = (props) => {
  // Newtorks & Providers
  const [signer, setSigner] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [userBalance, setUserBalance] = useState("");
  const [instances, setInstances] = useState("");

  const connect = async () => {
    if (window.ethereum == null) {
      console.log("MetaMask not installed");
    } else {
      const provider = new ethers.BrowserProvider(window.ethereum);
      try {
        const signer = await provider.getSigner();
        setSigner(signer);
      } catch (error) {
        console.error();
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setUserAddress(accounts[0]);
      try {
        const balance = await provider.getBalance(accounts[0]);
        const balanceInEther = ethers.formatEther(balance);
        const formattedBalance = parseFloat(balanceInEther).toFixed(2);
        console.log("Account balance:", formattedBalance);
        setUserBalance(formattedBalance);
      } catch (error) {}
    }
  };

  // useEffect(() => {
  //   const loadProvider = async () => {
  //     if (provider) {
  //       return;
  //     }
  //     try {
  //       const prov = new ethers.JsonRpcProvider(
  //         "https://rpc-amoy.polygon.technology"
  //       );
  //       setProvider(prov);
  //       console.log("block:", await prov.getBlockNumber());
  //       const contract = new ethers.Contract(
  //         "0xDD9B9311Df9bea81a8640C650981393544311F23",
  //         degenArtAbi,
  //         prov
  //       );
  //       console.log(await contract.totalSupply());
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   loadProvider();
  // }, []);

  const value = {
    signer,
    connect,
    userAddress,
    userBalance,
  };

  return (
    <NextUIProvider>
      <Context.Provider value={value}>{props.children}</Context.Provider>
    </NextUIProvider>
  );
};
