import { Context } from "@/providers/Providers";
import { Avatar, AvatarGroup, Tab, Tabs } from "@nextui-org/react";
import React, { useContext } from "react";
import { FancyCard } from "./FancyCard";
import { SelectNetwork } from "../functions/SelectNetwork";

export const Hero = () => {
  const { selectedHomeTab, setSelectedHomeTab } = useContext(Context);

  return (
    <section className="relative w-full h-full min-h-screen select-none">
      <div className="grid w-full p-6 md:grid-cols-4 gap-y-6 gap-x-12">
        <div className="min-h-[350px] w-full row-start-2 md:row-start-1 relative col-span-1 md:col-span-4 bg-zinc-100 rounded-lg">
          <FancyCard text="hover" />
          <div className="absolute top-6 right-6">
            <AvatarGroup isBordered max={4} radius="sm" total={10}>
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
            </AvatarGroup>
          </div>
          <div className="absolute bottom-[60px] left-[25px] md:bottom-[20px] md:left-[24.5vw]">
            <Tabs
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
          <div className="absolute px-3 py-1 text-sm rounded-full backdrop-blur-md bottom-3 right-3 md:bottom-6 md:right-6">
            Powered by OnChainVision Labs
          </div>
        </div>
        <div className="min-h-[400px] grid content-between p-6 w-full md:-translate-y-[100px] drop-shadow-md md:translate-x-6 col-span-1 bg-gradient-to-t from-blue-300 to-blue-200/50 rounded-lg backdrop-blur-sm">
          <div>
            <span>gm</span>
          </div>
          <div>
            <h1 className="text-2xl">
              dont let your <span className="font-semibold">mood</span> go to
              waste ser
            </h1>
          </div>
          <div className="flex justify-between">
          <SelectNetwork />
          </div>
        </div>
        {selectedHomeTab == "defi" && (
          <div className="min-h-[300px] w-full max-h-[300px] grid md:grid-cols-3 gap-6 md:col-span-3 rounded-lg">
            <div className="h-full min-h-[300px] bg-white drop-shadow-sm border rounded-lg"></div>
            <div className="h-full min-h-[300px] bg-white drop-shadow-sm border rounded-lg"></div>
            <div className="h-full min-h-[300px] bg-white drop-shadow-sm border rounded-lg"></div>
          </div>
        )}
        {selectedHomeTab == "game" && (
          <div className="min-h-[300px] w-full max-h-[300px] grid md:grid-cols-3 gap-6 md:col-span-3 rounded-lg">
            <div className="h-full min-h-[300px] bg-white drop-shadow-sm delay-150 border rounded-lg"></div>
            <div className="h-full min-h-[300px] bg-white drop-shadow-sm border rounded-lg"></div>
            <div className="h-full min-h-[300px] bg-white drop-shadow-sm border rounded-lg"></div>
          </div>
        )}
        {selectedHomeTab == "social" && (
          <div className="min-h-[300px] w-full max-h-[300px] grid md:grid-cols-3 gap-6 md:col-span-3 rounded-lg">
            <div className="h-full min-h-[300px] bg-white drop-shadow-sm border rounded-lg"></div>
            <div className="h-full min-h-[300px] bg-white drop-shadow-sm border rounded-lg"></div>
            <div className="h-full min-h-[300px] bg-white drop-shadow-sm border rounded-lg"></div>
          </div>
        )}
      </div>
    </section>
  );
};
