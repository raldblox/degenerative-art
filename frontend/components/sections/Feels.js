"use client";

import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import {
  FreeMode,
  Navigation,
  Thumbs,
  Pagination,
  Mousewheel,
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
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  User,
  Image,
  Spinner,
  Skeleton,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { SelectNetwork } from "../functions/SelectNetwork";
import { LockIcon } from "../icons/BasicIcons";
import { Context } from "@/providers/Providers";
import { networks } from "@/libraries/network";
import { ethers } from "ethers";

export default function Feels() {
  //   const { data: session, status } = useSession();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const {
    totalSupplies,
    randomFeels,
    fetching,
    setFetching,
    getFeels,
  } = useContext(Context);

  return (
    <div className="relative flex items-center justify-center w-full min-h-[calc(100vh-130px)] overflow-hidden ">
      <div className="h-[calc(100vh-50px)] p-0 md:h-[calc(100vh-150px)] w-full flex justify-center items-start md:flex-row flex-col md:gap-3 md:p-6 overflow-hidden">
        <div className=" hidden md:grid md:max-w-[300px] min-h-[300px] relative content-between p-6 w-full col-span-1 bg-white text-foreground rounded-2xl backdrop-blur-sm">
          <div>
            <span>gm ser 🌤</span>
          </div>
          <div className="space-y-6">
            <h1 className="text-3xl">
              how&apos;s the world treating you today?
            </h1>
          </div>

          <div className="flex justify-between">
            <Button color="primary" variant="solid" endContent={<LockIcon />}>
              Express Your Feels
            </Button>
          </div>
        </div>

        <>
          <Swiper
            className="mySwiper2 rounded-none md:rounded-2xl min-h-[75vh]"
            // style={{
            //   "--swiper-navigation-color": "#ddd",
            //   "--swiper-pagination-color": "#ddd",
            // }}
            loop={false}
            freeMode={true}
            spaceBetween={10}
            breakpoints={{
              "@0.0": {
                slidesPerView: 2,
              },
              "@1.00": {
                slidesPerView: 1,
              },
            }}
            mousewheel={true}
            direction={"vertical"}
            // thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Thumbs, Mousewheel]}
            onReachEnd={() => {
              getFeels();
            }}
          >
            {[...randomFeels?.entries()].map(([key, post]) => (
              <SwiperSlide key={key} className=" animate-appearance-in">
                <Card className="w-full h-full bg-transparent light ">
                  <CardHeader className="justify-between bg-white md:p-6">
                    <div className="flex w-full gap-5">
                      <Avatar isBordered radius="full" size="md" src="" />
                      <div className="flex flex-col items-start justify-center gap-1">
                        <h4 className="font-semibold leading-none text-small text-default-600">
                          Anonymous
                        </h4>
                        <h5 className="tracking-tight text-small text-default-400">
                          {post?.owner.slice(0, 7)}
                        </h5>
                      </div>
                    </div>
                    {/* <Button
                          isExternal
                          as={Link}
                          href={`https://x.com/`}
                          color="primary"
                          radius="full"
                          size="sm"
                          variant="flat"
                        >
                          Follow
                        </Button> */}
                    <div className="flex items-center justify-center h-full">
                      <ChainIcon chainName={post?.chainName} />
                    </div>
                  </CardHeader>
                  <CardBody className="flex items-center justify-center w-full h-full overflow-hidden text-4xl shadow-inner group md:text-7xl">
                    <div className="p-8 text-center cursor-pointer w-fit cell group">
                      <span className="absolute md:flex hidden text-nowrap scale-125 tracking-[-14rem] text-center z-0 text-[22rem] transition-all duration-1000 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 opacity-100 blur-3xl saturate-50">
                        {Object.values(post.emojis).slice().reverse().join(" ")}
                      </span>
                      <div
                        style={{
                          gridTemplateColumns: `repeat(${Math.sqrt(
                            post.emojis.length
                          )}, 1fr)`,
                        }}
                        className={`grid text-xl gap-[1px] mx-auto text-center duration-200 md:text-[2.3rem] content-center items-center justify-center rounded-xl w-fit`}
                      >
                        {Object.values(post.emojis)
                          .reverse()
                          .map((emoji, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-center w-8 leading-none tracking-tighter rounded-sm md:w-12 animate-appearance-in border-1 border-black/5 aspect-square"
                            >
                              {emoji}
                            </div>
                          ))}
                      </div>
                    </div>
                  </CardBody>
                  <CardFooter className="items-center justify-between w-full h-16 gap-3 p-3 bg-white md:p-6">
                    <div className="flex gap-1">
                      <p className="font-semibold text-default-400 text-small">
                        MOODART #{post?.tokenId.toString()}
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              </SwiperSlide>
            ))}
            {fetching && (
              <SwiperSlide className="bg-transparent animate-appearance-in">
                <Card className="w-full h-full bg-transparent light ">
                  <CardHeader className="justify-between bg-white md:p-6">
                    <div className="max-w-[300px] w-full flex items-center gap-3">
                      <div>
                        <Skeleton className="flex w-12 h-12 rounded-full" />
                      </div>
                      <div className="flex flex-col w-full gap-2">
                        <Skeleton className="w-3/5 h-3 rounded-lg" />
                        <Skeleton className="w-4/5 h-3 rounded-lg" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="flex items-center justify-center w-full h-full">
                    <div className="grid items-center content-center justify-center h-full grid-cols-3 gap-[1px] mx-auto w-fit">
                      <Skeleton className="flex w-12 h-12 rounded-sm" />
                      <Skeleton className="flex w-12 h-12 rounded-sm" />
                      <Skeleton className="flex w-12 h-12 rounded-sm" />
                      <Skeleton className="flex w-12 h-12 rounded-sm" />
                      <Skeleton className="flex w-12 h-12 rounded-sm" />
                      <Skeleton className="flex w-12 h-12 rounded-sm" />
                      <Skeleton className="flex w-12 h-12 rounded-sm" />
                      <Skeleton className="flex w-12 h-12 rounded-sm" />
                      <Skeleton className="flex w-12 h-12 rounded-sm" />
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
            className="md:!flex mySwiper !hidden md:!w-fit min-w-[300px]"
          >
            {[...randomFeels?.entries()].map(([key, post]) => (
              <SwiperSlide
                key={key}
                className="max-h-[100px] animate-appearance-in"
              >
                <div className="flex items-center justify-start h-full gap-3 p-3 bg-white rounded-xl">
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
      className="w-12 h-12 !rounded-none"
      src={network?.icon}
      alt={network?.chainName}
    />
  );
};
