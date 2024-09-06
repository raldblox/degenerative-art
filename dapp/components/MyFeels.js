"use client";

import {
  Button,
  Image,
  Link,
  Skeleton,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useContext, useEffect, useRef, useState } from "react";
import nftAbi from "@/libraries/DegenerativeArtABI.json";
import { Context } from "../providers/Providers";
import { ethers } from "ethers";
import { AssetLoader } from "./AssetLoader";
import UpdateToken from "./UpdateToken";

export const MyFeels = () => {
  const {
    userAddress,
    signer,
    countdown,
    timeUpdated,
    connectEthereumWallet,
    userNFTs,
    setUserNFTs,
    loading,
    setLoading,
    setSelectedTab,
  } = useContext(Context);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fieldsRef = useRef(null);
  const maxFields = 9;
  const inputRef = useRef([]);
  const [inputValues, setInputValues] = useState(Array(maxFields).fill(""));
  const [activeFields, setActiveFields] = useState(3);
  const [minting, setMinting] = useState(false);
  const [txHash, setTxHash] = useState("");

  return (
    <>
      <div className="grid gap-6 pb-12 lg:grid-cols-3 md:grid-cols-2">
        {userNFTs?.map((token) => (
          <div
            key={token.tokenId}
            className="relative flex flex-col items-center justify-center p-2 duration-200 border-2 shadow-md border-background bg-default-100 hover:shadow rounded-3xl"
          >
            <div className="grid w-full p-6 duration-300 bg-background group-hover:shadow rounded-2xl aspect-square animate-appearance-in">
              <div className="relative grid grid-cols-3 gap-2 md:gap-4 ">
                {token?.emojis?.map((emoji, i) => (
                  <div
                    className="flex items-center justify-center duration-200 cursor-pointer group"
                    key={i}
                  >
                    <span className="z-10 p-2 text-4xl text-center">
                      {emoji}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between w-full pt-2">
              <div className="flex flex-col items-start justify-between w-full px-2 text-xs text-foreground">
                <div className="flex items-center justify-between w-full font-semibold">
                  <p>degeneratives.art #{token.tokenId}</p>
                  <p>{token?.network}</p>
                </div>
                <div className="flex items-center gap-2">
                  {token.tokenId < 1039 && <UpdateToken token={token} />}
                </div>
              </div>
              <Button
                as={Link}
                isExternal
                href={`https://explorer.etherlink.com/token/0x5F440745E21D2F0388F7360586e8d92a9058BccC/instance/${token?.tokenId}`}
                radius="full"
                variant="light"
                className="flex items-center p-0"
                isIconOnly
              >
                <Image
                  src="/etherlink_icon.svg"
                  height={25}
                  width={75}
                  radius="none"
                />
              </Button>
              <Button
                as={Link}
                isExternal
                href={`https://rarible.com/token/etherlink/0x5F440745E21D2F0388F7360586e8d92a9058BccC:${token?.tokenId}`}
                radius="full"
                variant="light"
                className="flex items-center p-0"
                isIconOnly
              >
                <Image
                  src="/rarible_icon.svg"
                  height={20}
                  width={75}
                  radius="none"
                />
              </Button>
            </div>
            <Tooltip
              showArrow={true}
              color="primary"
              content="Mood Swing Counter"
            >
              <div className="absolute px-2 py-1 text-[10px] items-center text-foreground rounded-full bg-default-100 top-3 flex gap-1">
                {token.moodSwing}
                <svg
                  className="h-3"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="currentColor"
                    d="M5 3h14v2H5zm0 16H3V5h2zm14 0v2H5v-2zm0 0h2V5h-2zM10 8H8v2h2zm4 0h2v2h-2zm1 5H9v2h6z"
                  />
                </svg>
              </div>
            </Tooltip>

            {/* <div className="flex items-center justify-between gap-3">
              <Button size="sm" radius="full" className="text-sm">
                UPDATE
              </Button>
              <Button size="sm" radius="full" className="text-sm">
                EVOLVE
              </Button>
            </div> */}
          </div>
        ))}
        {loading && (
          <div className="">
            <AssetLoader />
          </div>
        )}

        {!loading && userNFTs.length == 0 && (
          <div className="flex flex-col items-center justify-center space-y-6 text-center md:col-span-3">
            <p className="text-2xl">No tokens found</p>
            <Button
              size="md"
              radius="full"
              variant="solid"
              color="default"
              className="text-white transition-all duration-300 bg-black w-fit"
              onClick={() => setSelectedTab("home")}
            >
              Mint your feels today
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
