import { Context } from "@/providers/Providers";
import { Avatar, AvatarGroup, Button, Tab, Tabs } from "@nextui-org/react";
import React, { useContext } from "react";
import { FancyCard } from "./FancyCard";
import { SelectNetwork } from "../functions/SelectNetwork";

export const Hero = () => {
  const { selectedHomeTab, setSelectedHomeTab } = useContext(Context);

  return (
    <section className="relative w-full h-full min-h-screen select-none">
      <div className="grid w-full p-3 md:p-6 md:grid-cols-4 gap-y-3 md:gap-y-6 gap-x-12">
        <div className="min-h-[400px] md:min-h-[310px] cursor-crosshair w-full row-start-2 md:row-start-1 relative col-span-1 md:col-span-4 from-primary-50 to-success-50 bg-gradient-to-tr rounded-lg">
          <FancyCard text="hover" />
          <div className="absolute max-w-[180px] space-y-3 right-3 top-6 md:right-6">
            <AvatarGroup color="success" max={4} radius="lg" total={200}>
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
            </AvatarGroup>
            <p className="text-xs">
              Join our homies in putting emotions to work!
            </p>
          </div>
          <div className="absolute drop-shadow-lg space-y-0 md:space-y-6 bottom-[130px] left-6 md:bottom-[125px] md:left-[25vw]">
            <h1 className="text-3xl md:text-[4vw] font-semibold text-foreground">
              degeneratives<span className="text-white">.art</span>
            </h1>
            <p className="text-xs md:text-sm">
              where emotions become art and currency
            </p>
          </div>

          <div className="absolute drop-shadow-md bottom-[60px] left-6 md:bottom-[20px] md:left-[24.5vw]">
            <Tabs
              radius="sm"
              size=""
              variant="solid"
              color="primary"
              aria-label="Options"
              selectedKey={selectedHomeTab}
              onSelectionChange={setSelectedHomeTab}
            >
              <Tab key="defi" title="DeFi" />
              <Tab key="game" title="GameFi" />
              <Tab key="social" title="SocialFi" />
            </Tabs>
          </div>
          <div className="absolute px-3 py-1 text-xs rounded-full drop-shadow-lg bg-white/50 backdrop-blur-md bottom-3 right-3 md:bottom-6 md:right-6">
            Powered by OnChainVision Labs
          </div>
        </div>
        <div className="min-h-[400px] relative grid content-between p-6 w-full md:-translate-y-[100px] md:translate-x-6 col-span-1 bg-gradient-to-t from-[#002fff] to-[#002fff]/60 text-background rounded-lg backdrop-blur-sm">
          <div>
            <span>gm 🌤</span>
          </div>
          <div className="space-y-6">
            <h1 className="text-2xl">
              dont let your <span className="font-semibold">mood</span> go to
              waste ser
            </h1>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                radius="sm"
                variant="flat"
                onClick={() => {
                  setSelectedHomeTab("social");
                }}
              >
                Mint
              </Button>
              <Button
                size="sm"
                radius="sm"
                variant="flat"
                onClick={() => {
                  setSelectedHomeTab("defi");
                }}
              >
                Stake
              </Button>
              <Button
                size="sm"
                radius="sm"
                variant="flat"
                onClick={() => {
                  setSelectedHomeTab("game");
                }}
              >
                Play
              </Button>
            </div>
          </div>

          <div className="flex justify-between">
            <SelectNetwork />
          </div>
          <div className="absolute hidden p-3 text-xs text-foreground md:flex -bottom-20 -left-6">
            MOOD empowers the degeneratives community to create, express, and
            play together within a unified, multi-chain ecosystem.
          </div>
        </div>
        {selectedHomeTab == "defi" && (
          <div className="min-h-[400px] w-full md:max-h-[400px] grid md:grid-cols-3  gap-3 md:gap-6 md:col-span-3 rounded-lg">
            <div className="h-full relative p-6 min-h-[400px] bg-default-200 hover:bg-white transition-all duration-300  rounded-lg">
              <span className="absolute flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full top-3 left-3 bg-foreground">
                🛍️
              </span>
            </div>
            <div className="h-full relative p-6 min-h-[400px] bg-default-200 hover:bg-white transition-all duration-300   rounded-lg">
              <span className="absolute flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full top-3 left-3 bg-foreground">
                🏊‍♀️
              </span>
            </div>
            <div className="h-full relative p-6 min-h-[400px] bg-default-200 hover:bg-white transition-all duration-300   rounded-lg">
              <span className="absolute flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full top-3 left-3 bg-foreground">
                🥩
              </span>
            </div>
          </div>
        )}
        {selectedHomeTab == "game" && (
          <div className="min-h-[300px]  w-full md:max-h-[400px] grid md:grid-cols-3 gap-3 md:gap-6 md:col-span-3 rounded-lg">
            <div className="h-full relative p-6 min-h-[400px] bg-default-200 hover:bg-white transition-all duration-300   rounded-lg">
              <span className="absolute flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full top-3 left-3 bg-foreground">
                ⚡️
              </span>
              
            </div>
            <div className="h-full relative p-6 min-h-[400px] bg-default-200 hover:bg-white transition-all duration-300   rounded-lg">
              <span className="absolute flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full top-3 left-3 bg-foreground">
                🎲
              </span>
            </div>
            <div className="h-full relative p-6 min-h-[400px] bg-default-200 hover:bg-white transition-all duration-300   rounded-lg">
              <span className="absolute flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full top-3 left-3 bg-foreground">
                💣
              </span>
            </div>
          </div>
        )}
        {selectedHomeTab == "social" && (
          <div className="min-h-[400px] text-background  w-full md:max-h-[300px] grid md:grid-cols-3 gap-3 md:gap-6 md:col-span-3 rounded-lg">
            <div className="h-full relative p-6 min-h-[400px] bg-default-200 hover:bg-white transition-all duration-300   rounded-lg">
              <span className="absolute flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full top-3 left-3 bg-foreground">
                🎨
              </span>
            </div>
            <div className="h-full relative p-6 min-h-[400px] bg-default-200 hover:bg-white transition-all duration-300   rounded-lg">
              <span className="absolute flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full top-3 left-3 bg-foreground">
                🖼
              </span>
            </div>
            <div className="h-full relative p-6 min-h-[400px] bg-default-200 hover:bg-white transition-all duration-300   rounded-lg">
              <span className="absolute flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full top-3 left-3 bg-foreground">
                🌿
              </span>
            </div>
          </div>
        )}
        <div className="min-h-[400px]  w-full max-h-[300px] grid md:col-span-4 rounded-lg bg-default-200 hover:bg-white transition-all duration-300 ">
          <div className="h-full relative p-6 min-h-[300px]    rounded-lg">
            <span className="absolute flex items-center justify-center w-10 h-10 p-2 text-lg transition-all duration-300 bg-black rounded-full hover:bg-white top-3 left-3">
              📊
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
