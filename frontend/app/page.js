"use client";

import Feels from "@/components/sections/Feels";
import { Hero } from "@/components/sections/Hero";
import Navigation from "@/components/sections/Navigation";
import { Context } from "@/providers/Providers";
import { Divider } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useContext, useState } from "react";
import Bridge from "./bridge/page";

export default function Home() {
  const { setSelectedNavTab, selectedNavTab, setSelectedNetwork } = useContext(
    Context
  );
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);

  if (!mounted) {
    const tab = searchParams.get("tab");
    const chain = searchParams.get("network");

    if (tab) {
      setSelectedNavTab(tab);
    }

    if (chain) {
      setSelectedNetwork(chain);
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
          {selectedNavTab == "bridge" && (
            <div className="">
              <Bridge />
            </div>
          )}
        </>
      )}

      {/* <Divider className="hidden md:block" /> */}
    </>
  );
}
