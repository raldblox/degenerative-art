import { Context } from "@/providers/Providers";
import {
  Avatar,
  AvatarGroup,
  Button,
  Image,
  Link,
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
import { PoolByNetwork } from "../functions/PoolByNetwork";
import { Statistics } from "../functions/Statistics";
import { useSession } from "next-auth/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Mousewheel, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { FlipWords } from "../functions/FlipWords";

export const Hero = () => {
  const {
    selectedHomeTab,
    setSelectedHomeTab,
    selectedNetwork,
    addToken,
    totalSupplies,
    setSelectedNavTab,
    showMintModal,
    setShowMintModal,
  } = useContext(Context);
  const { data: session, status } = useSession();

  const ChainIcon = () => {
    const network = networks.find(
      (chain) => chain.chainId === Number(selectedNetwork)
    );

    return (
      <Image
        className="!w-7 !h-7 !rounded-none grayscale p-1"
        src={network?.icon}
        alt={network?.chainName}
      />
    );
  };

  return (
    <section className="relative w-full h-full min-h-screen select-none">
      <div className="grid w-full px-3 md:px-6 lg:grid-cols-4 gap-y-3 md:gap-y-6 gap-x-12">
        <div className="min-h-[450px] md:min-h-[310px] cursor-crosshair w-full row-start-2 md:row-start-1 relative col-span-1 md:col-span-4 bg-default-50 rounded-2xl">
          <FancyCard text="hover" />
          <div className="absolute max-w-[180px] space-y-3 right-3 top-6 md:right-6">
            <AvatarGroup
              isBordered
              color="success"
              max={4}
              radius="lg"
              total={200}
            >
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
            </AvatarGroup>
            <p className="text-xs">
              Join our homies putting their emotions to work!
            </p>
          </div>
          <div className="absolute drop-shadow-lg space-y-3 md:space-y-6 bottom-[160px] left-6 md:bottom-[120px] md:left-[25vw]">
            <h1 className="text-3xl md:text-[4vw] font-semibold text-foreground">
              degeneratives
              <span className="">
                <FlipWords words={[".org", ".art", ".id", ".games"]} />
              </span>
            </h1>
            <p className="max-w-xl pr-3 text-xs md:text-sm text-balance">
              A decentralized creative platform utilizing unicode characters for
              generative art, onchain gaming, and defi apps within an
              interactive onchain ecosystem.
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
              <Tab key="nft" title="NFT" />
              <Tab key="game" title="GameFi" />
              <Tab key="tools" title="Tools" />
            </Tabs>
          </div>
          <div className="absolute px-3 py-1 text-xs rounded-full drop-shadow-lg bg-white/50 backdrop-blur-md bottom-3 right-3 md:bottom-6 md:right-6">
            <LinkPreview url="https://ocvlabs.com">
              Powered by OnChainVision Labs
            </LinkPreview>
          </div>
        </div>

        <div className="min-h-[450px] !md:max-w-[300px] relative grid content-between p-6 w-full md:-translate-y-[100px] md:translate-x-6 col-span-1 bg-gradient-to-t from-[#002fff] to-[#002fff]/60 text-background rounded-2xl backdrop-blur-sm">
          <div>
            <span className="lowercase">
              gm {session?.user.name.split(" ")[0]} 🌤
            </span>
          </div>
          <div className="space-y-6">
            <h1 className="text-2xl">
              dont let your{" "}
              <span className="font-semibold cursor-pointer">mood</span> go to
              waste ser
            </h1>
            <div className="flex flex-wrap items-center gap-1">
              <Button
                size="sm"
                radius="sm"
                variant="solid"
                onClick={() => {
                  setSelectedHomeTab("nft");
                  setShowMintModal(showMintModal ? false : true);
                }}
              >
                Mint
              </Button>
              <Button
                size="sm"
                radius="sm"
                variant="solid"
                href="/bridge"
                as={Link}
              >
                Bridge
              </Button>
              <Button
                size="sm"
                radius="sm"
                variant="solid"
                onClick={() => {
                  setSelectedNavTab("feels");
                }}
              >
                Explore
              </Button>
            </div>
          </div>

          <div className="flex justify-between">
            <SelectNetwork />
          </div>
          <p className="absolute items-start hidden px-0 text-xs text-default-700 md:flex h-[50px] leading-tight -bottom-16">
            MOOD empowers the degeneratives community to create, express, and
            play together within a unified, multi-chain ecosystem.
          </p>
        </div>

        {selectedHomeTab == "defi" && (
          <Swiper
            slidesPerView={"auto"}
            spaceBetween={25}
            // loop={true}
            mousewheel={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            modules={[Pagination, Mousewheel, Autoplay]}
            className="min-h-[450px] relative w-full md:max-h-[450px] gap-3 md:gap-6 md:col-span-3 rounded-2xl"
          >
            <SwiperSlide className="!h-full !w-[350px] min-h-[450px] bg-white hover:bg-success transition-all duration-300 rounded-2xl">
              <section className="grid content-between w-full h-full p-6 ">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 ">
                    <span className="flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full bg-default-800">
                      🛍️
                    </span>
                    <h1 className="text-3xl font-bold text-default-800">
                      swap
                    </h1>
                  </div>
                  <ChainIcon />
                </div>
                <div className="min-h-[300px] grid content-between">
                  <h1 className="text-lg text-default-700">
                    openly <span className="font-semibold">trade mood</span> on
                    decentralized exchanges.
                  </h1>
                  <div className="w-full">
                    <SwapByNetwork />
                  </div>
                </div>
              </section>
            </SwiperSlide>
            <SwiperSlide className="!h-full !w-[350px] min-h-[450px] bg-white hover:bg-success transition-all duration-300 rounded-2xl">
              <section className="grid content-between w-full h-full p-6 ">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 ">
                    <span className="flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full bg-default-800">
                      🏊‍♀️
                    </span>
                    <h1 className="text-3xl font-bold text-default-800">
                      pool
                    </h1>
                  </div>
                  <ChainIcon />
                </div>
                <div className="min-h-[300px] grid content-between">
                  <h1 className="text-lg lowercase text-default-700">
                    <span className="font-semibold">Provide liquidity</span> and
                    watch your rewards pour in!
                  </h1>
                  <div className="w-full">
                    <PoolByNetwork />
                  </div>
                </div>
              </section>
            </SwiperSlide>
            <SwiperSlide className="!h-full !w-[330px] min-h-[450px] bg-white hover:bg-success transition-all duration-300 rounded-2xl">
              <section className="grid content-between w-full h-full p-6 ">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 ">
                    <span className="flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full bg-default-800">
                      🌉
                    </span>
                    <h1 className="text-3xl font-bold text-default-800">
                      bridge
                    </h1>
                  </div>
                </div>
                <div className="min-h-[300px] grid content-between">
                  <h1 className="text-lg lowercase text-default-700">
                    bridge your degeneratives tokens to other blockchain.
                  </h1>
                  <div className="w-full">
                    <Button
                      size="md"
                      radius="sm"
                      color="primary"
                      variant="solid"
                      as={Link}
                      href="/bridge"
                    >
                      Open Bridge
                    </Button>
                  </div>
                </div>
              </section>
            </SwiperSlide>
            <SwiperSlide className="!h-full !w-[330px] min-h-[450px] bg-white hover:bg-success transition-all duration-300 rounded-2xl">
              <section className="grid content-between w-full h-full p-6 ">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 ">
                    <span className="flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full bg-default-800">
                      🥩
                    </span>
                    <h1 className="text-3xl font-bold text-default-800">
                      stake
                    </h1>
                  </div>
                  <ChainIcon />
                </div>
                <div className="min-h-[300px] grid content-between">
                  <h1 className="text-lg lowercase text-default-700">
                    stake your degeneratives tokens and{" "}
                    <span className="font-semibold">get mood rewards</span>.
                  </h1>
                  <div className="w-full">
                    <Button size="md" radius="sm" variant="solid">
                      Coming Soon
                    </Button>
                  </div>
                </div>
              </section>
            </SwiperSlide>
          </Swiper>
        )}

        {selectedHomeTab == "game" && (
          <>
            <Swiper
              slidesPerView={"auto"}
              spaceBetween={25}
              // loop={true}
              mousewheel={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              modules={[Pagination, Mousewheel, Autoplay]}
              className="min-h-[450px] relative w-full md:max-h-[450px] gap-3 md:gap-6 md:col-span-3 rounded-2xl"
            >
              <SwiperSlide className="!h-full !w-[350px] min-h-[450px] bg-white hover:bg-success transition-all duration-300 rounded-2xl">
                <section className="grid content-between w-full h-full p-6 ">
                  <div className="flex items-center gap-3 ">
                    <span className="flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full bg-default-800">
                      ⚡️
                    </span>
                    <h1 className="text-3xl font-bold text-default-800">
                      match
                    </h1>
                  </div>
                  <div className="flex items-center justify-center w-full">
                    <Image width={200} src="./soon.svg" />
                  </div>
                  <div className="w-full">
                    <Button size="md" radius="sm" variant="solid">
                      Coming Soon
                    </Button>
                  </div>
                </section>
              </SwiperSlide>
              <SwiperSlide className="!h-full !w-[350px] min-h-[450px] bg-white hover:bg-success transition-all duration-300 rounded-2xl">
                <section className="grid content-between w-full h-full p-6 ">
                  <div className="flex items-center gap-3 ">
                    <span className="flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full bg-default-800">
                      🎲
                    </span>
                    <h1 className="text-3xl font-bold text-default-800">
                      roll
                    </h1>
                  </div>
                  <div className="flex items-center justify-center w-full">
                    <Image width={200} src="./soon.svg" />
                  </div>
                  <div className="w-full">
                    <Button size="md" radius="sm" variant="solid">
                      Coming Soon
                    </Button>
                  </div>
                </section>
              </SwiperSlide>
              <SwiperSlide className="!h-full !w-[330px] min-h-[450px] bg-white hover:bg-success transition-all duration-300 rounded-2xl">
                <section className="grid content-between w-full h-full p-6 ">
                  <div className="flex items-center gap-3 ">
                    <span className="flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full bg-default-800">
                      💣
                    </span>
                    <h1 className="text-3xl font-bold text-default-800">
                      sweep
                    </h1>
                  </div>
                  <div className="flex items-center justify-center w-full">
                    <Image width={200} src="./soon.svg" />
                  </div>
                  <div className="w-full">
                    <Button size="md" radius="sm" variant="solid">
                      Coming Soon
                    </Button>
                  </div>
                </section>
              </SwiperSlide>
            </Swiper>
          </>
        )}
        {selectedHomeTab == "nft" && (
          <>
            <Swiper
              slidesPerView={"auto"}
              spaceBetween={25}
              // loop={true}
              mousewheel={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              modules={[Pagination, Mousewheel, Autoplay]}
              className="min-h-[450px] relative w-full md:max-h-[450px] gap-3 md:gap-6 md:col-span-3 rounded-2xl"
            >
              <SwiperSlide className="!h-full !w-[350px] min-h-[450px] bg-white hover:bg-success transition-all duration-300 rounded-2xl">
                <section className="grid content-between w-full h-full p-6 ">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 ">
                      <span className="flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full text-background bg-foreground">
                        🖼
                      </span>
                      <h1 className="text-3xl font-bold text-default-800">
                        mint
                      </h1>
                    </div>
                    <ChainIcon />
                  </div>
                  <div className="min-h-[300px] grid content-between">
                    <h1 className="text-lg lowercase text-default-700">
                      Mint your feels to receive free MOOD and express yourself
                      even more in our ecosystem!
                    </h1>
                    <h1 className="text-xs tracking-wide uppercase">
                      <span className="font-bold">1000 MOOD</span>rops await!
                    </h1>
                    <div className="flex items-center w-full gap-2">
                      <MintEmoji showSlider={false} defaultExpansionLevel={2} />
                      <Button
                        color="primary"
                        variant="bordered"
                        size="md"
                        radius="sm"
                        className=""
                        onClick={() => {
                          window.scrollTo(0, 0);
                          setTimeout(() => {
                            setSelectedNavTab("feels");
                          }, 500);
                        }}
                      >
                        Explore Feels
                      </Button>
                    </div>
                  </div>
                </section>
              </SwiperSlide>
              {/* <SwiperSlide className="!h-full !w-[350px] min-h-[450px] bg-white hover:bg-success transition-all duration-300 rounded-2xl">
                <section className="grid content-between w-full h-full p-6 ">
                  <div className="flex items-center gap-3 ">
                    <span className="flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full bg-default-800">
                      🎨
                    </span>
                    <h1 className="text-3xl font-bold text-default-800">
                      craft
                    </h1>
                  </div>
                  <div className="min-h-[300px] grid content-between">
                    <h1 className="text-lg lowercase text-default-700">
                      Break free from 3x3 grid! Make one-of-a-kind arts with our
                      Expandable Canvas.
                    </h1>
                    <h1 className="text-xs tracking-wide uppercase">
                      <span className="font-bold">1000 MOOD</span>rops await!
                    </h1>
                    <div className="flex items-center w-full gap-2">
                      <MintEmoji
                        showSlider={true}
                        defaultExpansionLevel={4}
                        forceStop={false}
                      />
                      <Button
                        color="primary"
                        variant="bordered"
                        size="md"
                        radius="sm"
                        className=""
                        onClick={() => {
                          window.scrollTo(0, 0);
                          setTimeout(() => {
                            setSelectedNavTab("feels");
                          }, 500);
                        }}
                      >
                        Explore Feels
                      </Button>
                    </div>
                  </div>
                </section>
              </SwiperSlide> */}
              <SwiperSlide className="!h-full !w-[350px] min-h-[450px] bg-white hover:bg-success transition-all duration-300 rounded-2xl">
                <section className="grid content-between w-full h-full p-6 ">
                  <div className="flex items-center gap-3 ">
                    <span className="flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full bg-default-800">
                      🎁
                    </span>
                    <h1 className="text-3xl font-bold text-default-800">
                      rewards
                    </h1>
                  </div>
                  <div className="min-h-[300px] grid content-between">
                    <h1 className="text-lg lowercase text-default-700 text-balance">
                      start claiming your moodart minting reward!
                    </h1>

                    <div className="flex items-center w-full gap-2">
                      <Button
                        size="md"
                        radius="sm"
                        variant="solid"
                        as={Link}
                        href="/claim"
                      >
                        Opening Soon
                      </Button>
                    </div>
                  </div>
                </section>
              </SwiperSlide>
              <SwiperSlide className="!h-full !w-[800px] min-h-[450px] bg-white hover:bg-success transition-all duration-300 rounded-2xl">
                <section className="grid content-between w-full h-full p-6 ">
                  <div className="flex items-center gap-3 ">
                    <span className="flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full bg-default-800">
                      🤖
                    </span>
                    <h1 className="text-3xl font-bold text-default-800">
                      analytics
                    </h1>
                  </div>
                  <div className="h-full">
                    <Statistics data={totalSupplies} />
                  </div>
                </section>
              </SwiperSlide>
            </Swiper>
          </>
        )}
        {selectedHomeTab == "tools" && (
          <>
            <Swiper
              slidesPerView={"auto"}
              spaceBetween={25}
              // loop={true}
              mousewheel={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              modules={[Pagination, Mousewheel, Autoplay]}
              className="min-h-[450px] relative w-full md:max-h-[450px] gap-3 md:gap-6 md:col-span-3 rounded-2xl"
            >
              <SwiperSlide className="!h-full !w-[330px] min-h-[450px] bg-white hover:bg-success transition-all duration-300 rounded-2xl">
                <section className="grid content-between w-full h-full p-6 ">
                  <div className="flex items-center gap-3 ">
                    <span className="flex items-center justify-center w-10 h-10 p-2 text-lg rounded-full bg-default-800">
                      🤖
                    </span>
                    <h1 className="text-3xl font-bold text-default-800">
                      generate
                    </h1>
                  </div>
                  <div className="min-h-[300px] grid content-between">
                    <h1 className="text-lg lowercase text-default-700">
                      Turn your existing digital image into a fascinating
                      artwork with emojis as pixels!
                    </h1>
                    <div className="w-full">
                      <Button size="md" radius="sm" variant="solid">
                        Coming Soon
                      </Button>
                    </div>
                  </div>
                </section>
              </SwiperSlide>
            </Swiper>
          </>
        )}
      </div>
    </section>
  );
};
