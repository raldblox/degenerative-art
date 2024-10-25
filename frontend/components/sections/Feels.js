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
import { useSession } from "next-auth/react";
import { FancyCard } from "./FancyCard";
import { FeelnCard } from "./FeelnCard";

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
  const { data: session, status } = useSession();
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty("--progress", 1 - progress);
    // progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };

  return (
    <div className="relative grid w-full min-h-screen md:min-h-[calc(100vh-170px)] ">
      <div className="h-screen md:h-[calc(100vh-130px)] w-full grid md:flex md:flex-row gap-3 py-3 md:px-6">
        <div className="md:grid hidden grid-cols-1 row-start-2 md:max-w-[350px] md:min-h-[300px] h-full max-h-[350px] content-between p-4 w-full col-span-1 space-y-3 bg-white text-foreground rounded-2xl backdrop-blur-sm">
          <div className="space-y-6">
            <span>gm {session?.user?.name.split(" ")[0]} 🌤</span>
            <h1 className="text-2xl md:text-4xl text-balance">
              how&apos;s the world treating you today?
            </h1>
          </div>
          <MintEmoji
            showSlider={true}
            defaultExpansionLevel={4}
            forceStop={false}
          />
        </div>

        <>
          <Swiper
            className="mySwiper2 !p-0 bg-black rounded-xl !w-full min-h-[400px] md:min-h-[75vh]"
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
              "@0.6": {
                slidesPerView: 1,
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
                <FeelnCard post={post} />
              </SwiperSlide>
            ))}
            {fetching && (
              <>
                <SwiperSlide className="w-full bg-transparent animate-appearance-in">
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
                <div className="flex items-center justify-between h-full gap-3 px-6 bg-white rounded-xl">
                  <div>
                    <h1 className="text-sm text-nowrap">
                      {`#${post?.tokenId.toString()}`}
                    </h1>
                  </div>
                  <div className="flex items-center justify-center h-full">
                    <ChainIcon chainName={post?.chainName} />
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
