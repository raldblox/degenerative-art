"use client";

import { Context } from "@/providers/Providers";
import { Button, Link, ScrollShadow } from "@nextui-org/react";
import React, { useContext } from "react";
import { LockIcon } from "../icons/BasicIcons";
import { LinkPreview } from "./LinkPreview";

export const PoolByNetwork = () => {
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
            // endContent={<LockIcon />}
            as={Link}
            href="https://www.iguanadex.com/liquidity?chain=etherlink"
            isExternal
          >
            <LinkPreview url="https://iguanadex.com/">IguanaDEX</LinkPreview>
          </Button>
          <Button
            color="primary"
            variant="bordered"
            size="md"
            radius="sm"
            className=""
            as={Link}
            href="https://app.tachyswap.org/#/add/0xd08B30c1EdA1284cD70E73F29ba27B5315aCc3F9/XTZ"
            isExternal
          >
            <LinkPreview url="https://tachyswap.org">TachySwap</LinkPreview>
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
            color="primary"
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
            color="primary"
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
            color="primary"
            variant="solid"
            size="md"
            radius="sm"
            className=""
            // endContent={<LockIcon />}
            as={Link}
            href="https://app.glyph.exchange/pool/v2/create/"
            isExternal
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
