"use client";

import Feels from "@/components/sections/Feels";
import { Hero } from "@/components/sections/Hero";
import Navigation from "@/components/sections/Navigation";
import { Context } from "@/providers/Providers";
import { Divider } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useContext, useState } from "react";
import Bridge from "./bridge/page";
import { networks } from "@/libraries/network";

export default function Home() {
  const { setSelectedNavTab, selectedNavTab, setSelectedNetwork } = useContext(
    Context
  );
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);

  if (!mounted) {
    const tab = searchParams.get("tab");
    const network = searchParams.get("network");

    if (tab) {
      setSelectedNavTab(tab);
    }

    if (network) {
      const foundNetwork = networks.find(
        (n) => n.chainName.toLowerCase() === network.toLowerCase() // Convert both to lowercase for case-insensitive comparison
      );
      if (foundNetwork) {
        setSelectedNetwork(foundNetwork.chainId.toString());
      } else {
        // Handle the case where the network is not found (e.g., display an error message)
        console.error("Network not found:", network);
      }
    }

    setMounted(true);
  }

  return (
    <>
      {mounted && (
        <>
          {selectedNavTab == "feels" && (
            <div className="w-full select-none relative min-h-[calc(100vh-180px)] overflow-hidden">
              <Feels />
            </div>
          )}
          {selectedNavTab == "home" && (
            <div className="">
              <Hero />
            </div>
          )}
          {/* {selectedNavTab == "bridge" && (
            <div className="">
              <Bridge />
            </div>
          )} */}
        </>
      )}

      {/* <Divider className="hidden md:block" /> */}
    </>
  );
}
