"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from "swiper/react";
import {
  FreeMode,
  Navigation,
  Thumbs,
  Pagination,
  Mousewheel,
  Autoplay,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Link,
  LinkIcon,
  Skeleton,
} from "@nextui-org/react";

import { LockIcon } from "../icons/BasicIcons";
import { Context } from "@/providers/Providers";
import { networks } from "@/libraries/network";
import { MintEmoji } from "../functions/MintEmoji";

export default function Feels() {
  //   const { data: session, status } = useSession();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const {
    totalSupplies,
    randomFeels,
    fetching,
    setFetching,
    getFeels,
    selectedChain,
    setSelectedHomeTab,
    setSelectedNavTab,
  } = useContext(Context);
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty("--progress", 1 - progress);
    // progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };

  return (
    <div className="relative flex items-start justify-center w-full min-h-[calc(100vh-170px)] ">
      <div className="h-[calc(100vh-160px)] md:h-[calc(100vh-130px)] w-full flex justify-center items-start lg:flex-row flex-col md:gap-3 px-3 md:px-6 overflow-hidden">
        <div className=" hidden lg:grid md:max-w-[300px] min-h-[300px] relative content-between p-4 w-full col-span-1 bg-white text-foreground rounded-2xl backdrop-blur-sm">
          <div>
            <span>gm ser 🌤</span>
          </div>
          <div className="space-y-6">
            <h1 className="text-3xl">
              how&apos;s the world treating you today?
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <MintEmoji />
            <Button color="success" variant="solid" endContent={<LockIcon />}>
              Express It
            </Button>
          </div>
        </div>

        <>
          <Swiper
            className="mySwiper2 !p-0 rounded-none min-h-[75vh]"
            // style={{
            //   "--swiper-navigation-color": "#ddd",
            //   "--swiper-pagination-color": "#ddd",
            // }}
            onAutoplayTimeLeft={onAutoplayTimeLeft}
            loop={false}
            freeMode={true}
            spaceBetween={10}
            breakpoints={{
              "@0.0": {
                slidesPerView: 1,
              },
              "@0.5": {
                slidesPerView: 2,
              },
              "@1.00": {
                slidesPerView: 1,
              },
            }}
            mousewheel={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            direction={"vertical"}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Thumbs, Mousewheel, Autoplay]}
            onReachEnd={() => {
              getFeels();
            }}
          >
            <div className="autoplay-progress" slot="container-end">
              <svg viewBox="0 0 48 48" ref={progressCircle}>
                <circle cx="24" cy="24" r="5"></circle>
              </svg>
            </div>
            {[...randomFeels?.entries()].map(([key, post]) => (
              <SwiperSlide key={key} className="border-none !rounded-none">
                <Card className="w-full h-full border shadow-none drop-shadow-none bg-default-100 !rounded-2xl light ">
                  <CardHeader className="relative flex items-center justify-between bg-white border-none shadow-none !rounded-none drop-shadow-none md:px-6 py-4">
                    <div className="flex items-center w-full gap-5">
                      <Avatar isBordered radius="full" size="sm" src="" />
                      <div className="flex flex-col items-start justify-center gap-1">
                        <h4 className="font-semibold leading-none text-small text-default-600">
                          Anonymous
                        </h4>
                        <h5 className="tracking-tight text-small text-default-400">
                          {post?.owner.slice(0, 7)}
                        </h5>
                      </div>
                    </div>
                    <TokenLink
                      chainName={post?.chainName}
                      tokenId={post?.tokenId}
                    />
                  </CardHeader>

                  <CardBody className="relative flex items-center justify-center w-full h-full overflow-hidden text-4xl shadow-inner group md:text-7xl">
                    <div className="p-8 text-center cursor-pointer w-fit cell group">
                      <span
                        className={`absolute invert text-nowrap tracking-[-14rem] -translate-x-2/4 scale-150 leading-none text-center z-0 text-[25rem] transition-all duration-500 transform  text-white -translate-y-1/2 top-1/2 left-2/4 opacity-10 saturate-100`}
                      >
                        {Object.values(post.emojis).slice().reverse().join(" ")}
                      </span>

                      <div
                        style={{
                          gridTemplateColumns: `repeat(${Math.sqrt(
                            post.emojis.length
                          )}, 1fr)`,
                        }}
                        className={`grid text-xl mx-auto text-center duration-200 md:text-[2.3rem] content-center items-center justify-center rounded-xl w-fit`}
                      >
                        {Object.values(post.emojis).map((emoji, index) => (
                          <div
                            key={index}
                            style={{
                              width: `${
                                window.innerWidth > 768
                                  ? 350 / Math.sqrt(post.emojis.length)
                                  : 280 / Math.sqrt(post.emojis.length)
                              }px`,
                              fontSize: `${
                                window.innerWidth > 768
                                  ? 280 / Math.sqrt(post.emojis.length)
                                  : 180 / Math.sqrt(post.emojis.length)
                              }px`,
                            }}
                            className={`flex items-center justify-center w-8 leading-none tracking-tighter border-1 border-white/20 aspect-square`}
                          >
                            {emoji}
                          </div>
                        ))}
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <ChainIcon chainName={post?.chainName} />
                      </div>
                    </div>
                  </CardBody>
                  <CardFooter className="items-center !rounded-none justify-between w-full gap-3 p-3 bg-white md:p-6">
                    <div className="grid gap-2">
                      <p className="font-semibold text-default-400 text-small">
                        MOODART #{post?.tokenId.toString()}
                      </p>
                      <Marketplace
                        chainName={post?.chainName}
                        tokenId={post?.tokenId}
                      />
                    </div>
                  </CardFooter>
                </Card>
              </SwiperSlide>
            ))}
            {fetching && (
              <>
                <SwiperSlide className="bg-transparent animate-appearance-in">
                  <Card className="w-full h-full bg-transparent light ">
                    <CardHeader className="justify-between bg-white md:p-6">
                      <div className="max-w-[300px] w-full flex items-center gap-3">
                        <div>
                          <Skeleton className="flex w-16 h-16 rounded-full" />
                        </div>
                        <div className="flex flex-col w-full gap-2">
                          <Skeleton className="w-3/5 h-3 rounded-lg" />
                          <Skeleton className="w-4/5 h-3 rounded-lg" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody className="flex items-center justify-center w-full h-full">
                      <div className="grid items-center content-center justify-center h-full grid-cols-3 gap-[1px] mx-auto w-fit">
                        <Skeleton className="flex w-16 h-16 rounded-sm" />
                        <Skeleton className="flex w-16 h-16 rounded-sm" />
                        <Skeleton className="flex w-16 h-16 rounded-sm" />
                        <Skeleton className="flex w-16 h-16 rounded-sm" />
                        <Skeleton className="flex w-16 h-16 rounded-sm" />
                        <Skeleton className="flex w-16 h-16 rounded-sm" />
                        <Skeleton className="flex w-16 h-16 rounded-sm" />
                        <Skeleton className="flex w-16 h-16 rounded-sm" />
                        <Skeleton className="flex w-16 h-16 rounded-sm" />
                      </div>
                    </CardBody>
                    <CardFooter className="items-center justify-between w-full h-16 gap-3 p-3 bg-white md:p-6">
                      <div className="flex gap-1">
                        <p className="font-semibold text-default-400 text-small">
                          MOODART BY DEGENS
                        </p>
                      </div>
                    </CardFooter>
                  </Card>
                </SwiperSlide>
              </>
            )}
          </Swiper>
          <Swiper
            onSwiper={setThumbsSwiper}
            loop={true}
            freeMode={true}
            watchSlidesProgress={true}
            mousewheel={true}
            modules={[FreeMode, Navigation, Thumbs, Pagination, Mousewheel]}
            breakpoints={{
              "@0.0": {
                slidesPerView: 2,
                spaceBetween: 10,
                direction: "horizontal",
              },
              "@1.00": {
                slidesPerView: 8,
                spaceBetween: 10,
                direction: "vertical",
              },
            }}
            className="lg:!flex mySwiper !hidden md:!w-fit min-w-[300px]"
          >
            {[...randomFeels?.entries()].map(([key, post]) => (
              <SwiperSlide key={key} className="max-h-[100px]">
                <div className="flex items-center justify-start h-full gap-3 px-6 bg-white rounded-xl">
                  <div className="flex items-center justify-center h-full">
                    <ChainIcon chainName={post?.chainName} />
                  </div>
                  <div>
                    <h1 className="text-sm text-nowrap">
                      {`#${post?.tokenId.toString()}`}
                    </h1>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      </div>
    </div>
  );
}

const ChainIcon = ({ chainName }) => {
  const network = networks.find((chain) => chain.chainName === chainName);

  return (
    <Image
      width={20}
      className="w-16 h-16 !rounded-none"
      src={network?.icon}
      alt={network?.chainName}
    />
  );
};

const TokenLink = ({ chainName, tokenId }) => {
  const network = networks.find((chain) => chain.chainName === chainName);

  const id = tokenId ? tokenId : 0;

  return (
    <Button
      isExternal
      as={Link}
      href={`${network?.blockExplorerUrls[0]}/nft/${network?.contracts?.moodArt}/${id}`}
      color="primary"
      radius="full"
      size="sm"
      variant="flat"
    >
      View
    </Button>
  );
};

const Marketplace = ({ chainName, tokenId }) => {
  const network = networks.find((chain) => chain.chainName === chainName);
  const id = tokenId ? tokenId : 0;

  return (
    <div className="flex items-center gap-2">
      {network?.marketplaces.map((marketplace, index) => {
        // Construct the marketplace URL based on its schema
        let marketplaceUrl;
        switch (marketplace.name) {
          case "Rarible":
            marketplaceUrl = `${
              marketplace.link
            }/${network.chainName.toLowerCase()}/${
              network.contracts.moodArt
            }:${id}`;
            break;
          case "Opensea":
            const chainNameForOpensea =
              network.chainName === "Polygon"
                ? "matic"
                : network.chainName.toLowerCase();
            marketplaceUrl = `${marketplace.link}/${chainNameForOpensea}/${network.contracts.moodArt}/${id}`;
            break;
          case "MagicEden":
            marketplaceUrl = `${
              marketplace.link
            }/${network.chainName.toLowerCase()}/${
              network.contracts.moodArt
            }/${id}`;
            break;
          case "YoungParrot":
            marketplaceUrl = `${marketplace.link}/${network.contracts.moodArt}/${id}`;
            break;
          default:
            marketplaceUrl = "#"; // Or handle the default case as needed
        }

        return (
          <Link
            key={index}
            isExternal
            href={marketplaceUrl}
            color="primary"
            radius="full"
            size="md"
            variant="flat"
          >
            <Image
              width={20}
              className="w-7 h-7 !rounded-none"
              src={marketplace?.icon}
              alt={marketplace?.name}
            />
          </Link>
        );
      })}
    </div>
  );
};
