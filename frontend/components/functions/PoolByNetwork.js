"use client";

import { Context } from "@/providers/Providers";
import { Button, Link, div } from "@nextui-org/react";
import React, { useContext } from "react";
import { LockIcon } from "../icons/BasicIcons";
import { LinkPreview } from "./LinkPreview";

export const PoolByNetwork = () => {
  const { selectedNetwork } = useContext(Context);
  return (
    <>
      {selectedNetwork == "42793" && (
        <div className="div flex items-center flex-wrap !w-full gap-1">
          <Button
            color="default"
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
            color="default"
            variant="solid"
            size="md"
            radius="sm"
            className=""
            as={Link}
            href="https://app.tachyswap.org/#/add/0xd08B30c1EdA1284cD70E73F29ba27B5315aCc3F9/XTZ"
            isExternal
          >
            <LinkPreview url="https://tachyswap.org">TachySwap</LinkPreview>
          </Button>
        </div>
      )}
      {selectedNetwork == "137" && (
        <div className="div flex items-center flex-wrap !w-full gap-1">
          <Button
            color="default"
            variant="solid"
            size="md"
            radius="sm"
            className=""
            endContent={<LockIcon />}
          >
            <LinkPreview url="https://quickswap.exchange/">
              QuickSwap
            </LinkPreview>
          </Button>
          <Button
            color="default"
            variant="solid"
            size="md"
            radius="sm"
            className=""
            endContent={<LockIcon />}
          >
            <LinkPreview url="https://uniswap.org/">Uniswap</LinkPreview>
          </Button>
        </div>
      )}
      {selectedNetwork == "8453" && (
        <div className="div flex items-center flex-wrap !w-full gap-1">
          <Button
            color=""
            variant="solid"
            size="md"
            radius="sm"
            className=""
            endContent={<LockIcon />}
          >
            <LinkPreview url="https://aerodrome.finance/">
              Aerodrome
            </LinkPreview>
          </Button>
          <Button
            color="default"
            variant="solid"
            size="md"
            radius="sm"
            className=""
            endContent={<LockIcon />}
          >
            <LinkPreview url="https://uniswap.org/">Uniswap</LinkPreview>
          </Button>
        </div>
      )}
      {selectedNetwork == "1116" && (
        <div className="div flex items-center flex-wrap !w-full gap-1">
          <Button
            color="default"
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
        </div>
      )}
      {selectedNetwork == "42161" && (
        <div className="div flex items-center flex-wrap !w-full gap-1">
          <Button
            color=""
            variant="solid"
            size="md"
            radius="sm"
            className=""
            endContent={<LockIcon />}
          ></Button>
        </div>
      )}
      {selectedNetwork == "56" && (
        <div className="div flex items-center flex-wrap !w-full gap-1">
          <Button
            color=""
            variant="solid"
            size="md"
            radius="sm"
            className=""
            endContent={<LockIcon />}
          >
            <LinkPreview url="https://pancakeswap.finance/">
              Pancakeswap
            </LinkPreview>
          </Button>
        </div>
      )}
    </>
  );
};
