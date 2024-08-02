import React from "react";
import { Button, Skeleton } from "@nextui-org/react";
import EmojisContainer from "./EmojisContainer";

export const AssetLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center p-2 duration-200 border-2 border-white shadow-md bg-default-100 hover:shadow rounded-3xl">
      <div className="p-6 duration-300 bg-white group-hover:shadow rounded-2xl">
        <EmojisContainer
          token={{
            tokenId: "-",
            owner: "--",
            emojis: [
              <>
                <Skeleton className="h-16 rounded-full">
                  <div className="w-16 h-16 rounded-full bg-default-200"></div>
                </Skeleton>
              </>,
              <>
                <Skeleton className="h-16 rounded-full">
                  <div className="w-16 h-16 rounded-full bg-default-200"></div>
                </Skeleton>
              </>,
              <>
                <Skeleton className="h-16 rounded-full">
                  <div className="w-16 h-16 rounded-full bg-default-200"></div>
                </Skeleton>
              </>,
              <>
                <Skeleton className="h-16 rounded-full">
                  <div className="w-16 h-16 rounded-full bg-default-200"></div>
                </Skeleton>
              </>,
              <>
                <Skeleton className="h-16 rounded-full">
                  <div className="w-16 h-16 rounded-full bg-default-200"></div>
                </Skeleton>
              </>,
              <>
                <Skeleton className="h-16 rounded-full">
                  <div className="w-16 h-16 rounded-full bg-default-200"></div>
                </Skeleton>
              </>,
              <>
                <Skeleton className="h-16 rounded-full">
                  <div className="w-16 h-16 rounded-full bg-default-200"></div>
                </Skeleton>
              </>,
              <>
                <Skeleton className="h-16 rounded-full">
                  <div className="w-16 h-16 rounded-full bg-default-200"></div>
                </Skeleton>
              </>,
              <>
                <Skeleton className="h-16 rounded-full">
                  <div className="w-16 h-16 rounded-full bg-default-200"></div>
                </Skeleton>
              </>,
            ],
            network: "polygonAmoy",
          }}
        />
      </div>
      <div className="flex flex-col items-start justify-between w-full px-2 pt-3 pb-1 text-xs text-black">
        <div className="flex items-center justify-between w-full font-semibold">
          <p>degeneratives.art</p>
          <p>--</p>
        </div>
        <div className="">
          <p>...</p>
        </div>
      </div>
      {/* <div className="flex items-center justify-start w-full gap-1 mt-2">
        <Button radius="full" size="sm">
          update
        </Button>
        <Button radius="full" size="sm">
          stake
        </Button>
      </div> */}
    </div>
  );
};
