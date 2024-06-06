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
      const prov = new ethers.JsonRpcProvider(
        "https://rpc-amoy.polygon.technology"
      );
      setProvider(prov);
      console.log("block:", await prov.getBlockNumber());
      const contract = new ethers.Contract(
        "0x79f3557b73f89df0e54a6d5b71d63fd098ed6af4",
        degenArtAbi,
        prov
      );
      console.log(await contract.totalSupply());
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
