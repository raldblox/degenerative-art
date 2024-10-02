"use client";

import { Hero } from "@/components/sections/Hero";
import Navigation from "@/components/sections/Navigation";
import { Context } from "@/providers/Providers";
import { useContext, useState } from "react";

export default function Home() {
  const { setSelectedNavTab, selectedNavTab } = useContext(Context);

  return (
    <>
      <Navigation />
      {selectedNavTab == "dashboard" && (
        <>
          <Hero />
        </>
      )}
    </>
  );
}
