"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ethers } from "ethers";
import { SessionProvider, useSession } from "next-auth/react";
import { createContext, useState } from "react";

export const Context = createContext();

export const Providers = (props) => {
  const [selectedHomeTab, setSelectedHomeTab] = useState("defi");
  const value = { selectedHomeTab, setSelectedHomeTab };

  return (
    <NextUIProvider>
      <Context.Provider value={value}>
        <SessionProvider>{props.children}</SessionProvider>
      </Context.Provider>
    </NextUIProvider>
  );
};