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
  const [provider, setProvider] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [accountBalance, setAccountBalance] = useState("");
  const [instances, setInstances] = useState("");

  useEffect(() => {
    const loadProvider = async () => {
      if (provider) {
        return;
      }
      try {
        const prov = new ethers.JsonRpcProvider(
          "https://rpc-amoy.polygon.technology"
        );
        setProvider(prov);
        console.log("block:", await prov.getBlockNumber());
        const contract = new ethers.Contract(
          "0xDD9B9311Df9bea81a8640C650981393544311F23",
          degenArtAbi,
          prov
        );
        console.log(await contract.totalSupply());
      } catch (error) {
        console.log(error);
      }
    };

    loadProvider();
  }, []);

  const value = {
    provider,
    signer,
  };

  return (
    <NextUIProvider>
      <Context.Provider value={value}>{props.children}</Context.Provider>
    </NextUIProvider>
  );
};
