"use client";

import { Hero } from "@/components/sections/Hero";
import Navigation from "@/components/sections/Navigation";
import { useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [selectedTab, setSelectedTab] = useState("home");

  return (
    <>
      <Navigation />
      <Hero />
    </>
  );
}
