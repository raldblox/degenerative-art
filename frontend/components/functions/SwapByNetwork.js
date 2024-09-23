"use client";

import { Context } from "@/providers/Providers";
import { Button, Link, ScrollShadow } from "@nextui-org/react";
import React, { useContext } from "react";
import { LockIcon } from "../icons/BasicIcons";
import { LinkPreview } from "./LinkPreview";

export const SwapByNetwork = () => {
  const { selectedNetwork } = useContext(Context);
  return (
    <>
      {selectedNetwork == "42793" && (
        <ScrollShadow className="max-h-[150px] flex items-center flex-wrap !w-full gap-1">
          <Button
            color="primary"
            variant="solid"
            size="md"
            radius="sm"
            className=""
            as={Link}
            href="https://app.tachyswap.org/#/swap?outputCurrency=0xd08b30c1eda1284cd70e73f29ba27b5315acc3f9"
            isExternal
          >
            <LinkPreview url="https://tachyswap.org">TachySwap</LinkPreview>
          </Button>
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            className="border-2 border-black dark "
            endContent={<LockIcon />}
          >
            <LinkPreview url="https://iguanadex.com/">IguanaDEX</LinkPreview>
          </Button>
        </ScrollShadow>
      )}
      {selectedNetwork == "137" && (
        <ScrollShadow className="max-h-[150px] flex items-center flex-wrap !w-full gap-1">
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            className="border-2 border-black dark "
            endContent={<LockIcon />}
          >
            <LinkPreview url="https://quickswap.exchange/">
              QuickSwap
            </LinkPreview>
          </Button>
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            className="border-2 border-black dark "
            endContent={<LockIcon />}
          >
            <LinkPreview url="https://uniswap.org/">Uniswap</LinkPreview>
          </Button>
        </ScrollShadow>
      )}
      {selectedNetwork == "8453" && (
        <ScrollShadow className="max-h-[150px] flex items-center flex-wrap !w-full gap-1">
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            className="border-2 border-black dark "
            endContent={<LockIcon />}
          >
            <LinkPreview url="https://aerodrome.finance/">
              Aerodrome
            </LinkPreview>
          </Button>
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            className="border-2 border-black dark "
            endContent={<LockIcon />}
          >
            <LinkPreview url="https://uniswap.org/">Uniswap</LinkPreview>
          </Button>
        </ScrollShadow>
      )}
      {selectedNetwork == "1116" && (
        <ScrollShadow className="max-h-[150px] flex items-center flex-wrap !w-full gap-1">
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            className="border-2 border-black dark "
            endContent={<LockIcon />}
          >
            <LinkPreview url="https://glyph.exchange/">
              Glyph Exchange
            </LinkPreview>
          </Button>
        </ScrollShadow>
      )}
      {selectedNetwork == "42161" && (
        <ScrollShadow className="max-h-[150px] flex items-center flex-wrap !w-full gap-1">
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            className="border-2 border-black dark "
            endContent={<LockIcon />}
          ></Button>
        </ScrollShadow>
      )}
      {selectedNetwork == "56" && (
        <ScrollShadow className="max-h-[150px] flex items-center flex-wrap !w-full gap-1">
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            className="border-2 border-black dark "
            endContent={<LockIcon />}
          >
            <LinkPreview url="https://pancakeswap.finance/">
              Pancakeswap
            </LinkPreview>
          </Button>
        </ScrollShadow>
      )}
    </>
  );
};
