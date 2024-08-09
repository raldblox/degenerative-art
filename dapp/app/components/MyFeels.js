"use client";

import {
  Button,
  Image,
  Link,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import { useContext, useEffect, useRef, useState } from "react";
import nftAbi from "@/app/libraries/DegenerativeArtABI.json";
import { Context } from "../providers/Providers";
import { ethers } from "ethers";
import { AssetLoader } from "./AssetLoader";

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
      <div className="grid gap-6 md:grid-cols-3">
        {userNFTs?.map((token) => (
          <Link
            isExternal
            href={`/id/${token.tokenId}`}
            key={token.tokenId}
            className="flex flex-col items-center justify-center p-2 duration-200 border-2 border-white shadow-md bg-default-100 hover:shadow rounded-3xl"
          >
            <div className="grid w-full p-6 duration-300 bg-white group-hover:shadow rounded-2xl aspect-square animate-appearance-in">
              <div className="relative grid grid-cols-3 gap-2 md:gap-4 ">
                {token?.emojis?.map((emoji, i) => (
                  <div
                    className="flex items-center justify-center duration-200 cursor-pointer group"
                    key={i}
                  >
                    <span className="z-10 text-3xl text-center">{emoji}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between w-full pt-3 pb-2">
              <div className="flex flex-col items-start justify-between w-full px-2 text-xs text-black">
                <div className="flex items-center justify-between w-full font-semibold">
                  <p>degeneratives.art #{token.tokenId}</p>
                  <p>{token?.network}</p>
                </div>
                <div className="">
                  <p>
                    by {token.owner.slice(0, 5)}
                    ...
                    {token.owner.slice(-4)}
                  </p>
                </div>
              </div>
              <Button
                as={Link}
                isExternal
                href={`https://explorer.etherlink.com/token/0xCF552524772605DE32DAe649f7ceD60a286b0D21/instance/${token?.tokenId}`}
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
                href={`https://rarible.com/token/etherlink/0xcf552524772605de32dae649f7ced60a286b0d21:${token?.tokenId}`}
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
            {/* <div className="flex items-center justify-between gap-3">
              <Button size="sm" radius="full" className="text-sm">
                UPDATE
              </Button>
              <Button size="sm" radius="full" className="text-sm">
                EVOLVE
              </Button>
            </div> */}
          </Link>
        ))}
        {loading && (
          <div className="">
            <AssetLoader />
          </div>
        )}
      </div>
    </>
  );
};
