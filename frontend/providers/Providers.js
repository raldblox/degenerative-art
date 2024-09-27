"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ethers } from "ethers";
import { SessionProvider, useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";

export const Context = createContext();

export const Providers = (props) => {
  const [selectedHomeTab, setSelectedHomeTab] = useState("defi");
  const [selectedNetwork, setSelectedNetwork] = useState(new Set([]));
  const [hasToken, setHasToken] = useState(false);

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
  };

  return (
    <NextUIProvider>
      <Context.Provider value={value}>
        <SessionProvider>{props.children}</SessionProvider>
      </Context.Provider>
    </NextUIProvider>
  );
};
