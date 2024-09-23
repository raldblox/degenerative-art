import { Context } from "@/providers/Providers";
import {
  Avatar,
  AvatarGroup,
  Button,
  Image,
  ScrollShadow,
  Tab,
  Tabs,
} from "@nextui-org/react";
import React, { useContext, useState } from "react";
import { FancyCard } from "./FancyCard";
import { SelectNetwork } from "../functions/SelectNetwork";
import { SwapByNetwork } from "../functions/SwapByNetwork";
import { networks } from "@/libraries/network";
import { MintEmoji } from "../functions/MintEmoji";
import { ExpandableCards } from "./ExpandableCards";
import { FunCard } from "../cards/FunCard";
import { LinkPreview } from "../functions/LinkPreview";

export const Hero = () => {
  const { selectedHomeTab, setSelectedHomeTab, selectedNetwork } = useContext(
    Context
  );

  const ChainIcon = () => {
    const network = networks.find(
      (chain) => chain.chainId === Number(selectedNetwork)
    );
    return (
      <Image
        className="w-6 h-6 rounded-none grayscale"
        src={network?.icon}
        alt={network?.chainName}
      />
    );
  };

  return (
    <section className="relative w-full h-full min-h-screen">
      <div className="grid w-full p-3 md:p-6 md:grid-cols-4 gap-y-3 md:gap-y-6 gap-x-12">
        <div className="min-h-[450px] md:min-h-[310px] cursor-crosshair w-full row-start-2 md:row-start-1 relative col-span-1 md:col-span-4 from-primary-50/80 to-primary-100/80 backdrop-blur-sm bg-gradient-to-tr rounded-lg">
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

          <div className="absolute drop-shadow-md bottom-[60px] left-6 md:bottom-[20px] md:left-[25vw]">
            <Tabs
              radius="full"
              size=""
              variant="solid"
              color="primary"
              aria-label="Options"
              selectedKey={selectedHomeTab}
              onSelectionChange={setSelectedHomeTab}
            >
              <Tab key="defi" title="DeFi" />
              <Tab key="social" title="SocialFi" />
              <Tab key="game" title="GameFi" />
            </Tabs>
          </div>
          <div className="absolute px-3 py-1 text-xs rounded-full drop-shadow-lg bg-white/50 backdrop-blur-md bottom-3 right-3 md:bottom-6 md:right-6">
            <LinkPreview url="https://ocvlabs.com">
              Powered by OnChainVision Labs
            </LinkPreview>
          </div>
        </div>

        <div className="min-h-[450px] relative grid content-between p-6 w-full md:-translate-y-[100px] md:translate-x-6 col-span-1 bg-gradient-to-t from-[#002fff] to-[#002fff]/60 text-background rounded-lg backdrop-blur-sm">
          <div>
            <span>gm 🌤</span>
          </div>
          <div className="space-y-6">
            <h1 className="text-2xl">
              dont let your <span className="font-semibold">mood</span> go to
              waste ser
            </h1>
            <div className="flex flex-wrap items-center gap-1">
              <Button
                size="sm"
                radius="sm"
                variant="solid"
                onClick={() => {
                  setSelectedHomeTab("social");
                }}
              >
                Mint
              </Button>
              <Button
                size="sm"
                radius="sm"
                variant="solid"
                onClick={() => {
                  setSelectedHomeTab("defi");
                }}
              >
                Stake
              </Button>
              <Button
                size="sm"
                radius="sm"
                variant="solid"
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
          <p className="absolute items-start hidden p-3 text-xs text-foreground md:flex h-[50px]  -bottom-16 -left-6">
            MOOD empowers the degeneratives community to create, express, and
            play together within a unified, multi-chain ecosystem.
          </p>
        </div>

        {selectedHomeTab == "defi" && (
          <div className="min-h-[450px] w-full md:max-h-[450px] grid md:grid-cols-3  gap-3 md:gap-6 md:col-span-3 rounded-lg">
            {/* <div className="w-full col-span-3">
              <ExpandableCards />
            </div> */}
            <div className="h-full relative grid content-between p-6 min-h-[450px] bg-white hover:bg-success transition-all duration-300  rounded-lg">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 ">
                  <span className="flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full bg-foreground">
                    🛍️
                  </span>
                  <h1 className="text-xl font-semibold">swap</h1>
                </div>
                <ChainIcon />
              </div>
              <div className="min-h-[300px] grid content-between">
                <h1 className="text-xl ">
                  openly <span className="font-semibold">trade mood</span> on
                  decentralized exchanges.
                </h1>
                <div className="w-full">
                  <SwapByNetwork />
                </div>
              </div>
            </div>
            <div className="h-full grid content-between p-6 min-h-[450px] bg-white hover:bg-success transition-all duration-300  rounded-lg">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 ">
                  <span className="flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full bg-foreground">
                    🏊‍♀️
                  </span>
                  <h1 className="text-xl font-semibold">pool</h1>
                </div>
                <ChainIcon />
              </div>
              <div className="min-h-[300px] grid content-between">
                <h1 className="text-xl lowercase ">
                  {/* pool your assets, not your sorrows.{" "} */}
                  <span className="font-semibold">Provide liquidity</span> and
                  watch rewards pour in!
                </h1>
                <div className="w-full"></div>
              </div>
            </div>
            <div className="h-full grid content-between p-6 min-h-[450px] bg-white hover:bg-success transition-all duration-300  rounded-lg">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 ">
                  <span className="flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full bg-foreground">
                    🥩
                  </span>
                  <h1 className="text-xl font-semibold">stake</h1>
                </div>
                <ChainIcon />
              </div>
              <div className="min-h-[300px] grid content-between">
                <h1 className="text-xl lowercase ">
                  stake your tokens and{" "}
                  <span className="font-semibold">get mood rewards</span> on top
                  of trading fees.
                </h1>
                <div className="w-full"></div>
              </div>
            </div>
          </div>
        )}
        {selectedHomeTab == "game" && (
          <div className="min-h-[300px]  w-full md:max-h-[450px] grid md:grid-cols-3 gap-3 md:gap-6 md:col-span-3 rounded-lg">
            <div className="h-full grid content-between p-6 min-h-[450px] bg-white/80 backdrop-blur-sm hover:bg-success transition-all duration-300  rounded-lg">
              <div className="flex items-center gap-3 ">
                <span className="flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full bg-foreground">
                  ⚡️
                </span>
                <h1 className="text-xl font-semibold">match</h1>
              </div>
              <div></div>
            </div>
            <div className="h-full grid content-between p-6 min-h-[450px] bg-white/80 backdrop-blur-sm hover:bg-success transition-all duration-300  rounded-lg">
              <div className="flex items-center gap-3 ">
                <span className="flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full bg-foreground">
                  🎲
                </span>
                <h1 className="text-xl font-semibold">roll</h1>
              </div>
              <div></div>
            </div>
            <div className="h-full grid content-between p-6 min-h-[450px] bg-white/80 backdrop-blur-sm hover:bg-success transition-all duration-300  rounded-lg">
              <div className="flex items-center gap-3 ">
                <span className="flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full bg-foreground">
                  💣
                </span>
                <h1 className="text-xl font-semibold">sweep</h1>
              </div>
              <div></div>
            </div>
          </div>
        )}
        {selectedHomeTab == "social" && (
          <div className="min-h-[450px]  w-full md:max-h-[300px] grid md:grid-cols-3 gap-3 md:gap-6 md:col-span-3 rounded-lg">
            <div className="h-full relative grid content-between p-6 min-h-[450px] bg-white hover:bg-success transition-all duration-300  rounded-lg">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 ">
                  <span className="flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full text-background bg-foreground">
                    🖼
                  </span>
                  <h1 className="text-xl font-semibold">mint</h1>
                </div>
                <ChainIcon />
              </div>
              <div className="min-h-[300px] grid content-between">
                <h1 className="text-xl lowercase ">
                  Mint your feels and receive free MOOD to express yourself even
                  more!
                </h1>
                <div className="w-full">
                  <MintEmoji />
                </div>
              </div>
            </div>

            <div className="h-full grid content-between p-6 min-h-[450px] bg-white hover:bg-success transition-all duration-300  rounded-lg">
              <div className="flex items-center gap-3 ">
                <span className="flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full bg-foreground">
                  🎨
                </span>
                <h1 className="text-xl font-semibold">craft</h1>
              </div>
              <div className="min-h-[300px] grid content-between">
                <h1 className="text-xl lowercase ">
                  Break free from 3x3 grid! Make one-of-a-kind NFTs with our
                  Flex Canvas.
                </h1>
                <div className="w-full"></div>
              </div>
            </div>
            <div className="h-full grid content-between p-6 min-h-[450px] bg-white hover:bg-success transition-all duration-300  rounded-lg">
              <div className="flex items-center gap-3 ">
                <span className="flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full bg-foreground">
                  🤖
                </span>
                <h1 className="text-xl font-semibold">generate</h1>
              </div>
              <div className="min-h-[300px] grid content-between">
                <h1 className="text-xl lowercase ">
                  Turn your existing work into intriguing art with emojis as
                  pixels!
                </h1>
                <div className="w-full"></div>
              </div>
            </div>
          </div>
        )}

        <div className="min-h-[450px]  w-full max-h-[300px] grid md:col-span-4 rounded-lg bg-white hover:bg-black transition-all duration-300 ">
          <div className="h-full relative p-6 min-h-[300px]    rounded-lg">
            <span className="absolute flex items-center justify-center w-10 h-10 p-2 text-lg transition-all duration-300 bg-black rounded-full hover:bg-success top-3 left-3">
              📊
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
