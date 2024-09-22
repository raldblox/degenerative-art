"use client";

import { Context } from "@/providers/Providers";
import { Button, ScrollShadow } from "@nextui-org/react";
import React, { useContext } from "react";

export const SwapByNetwork = () => {
  const { selectedNetwork } = useContext(Context);
  return (
    <>
      {selectedNetwork == "42793" && (
        <ScrollShadow className="max-h-[150px] flex items-center flex-wrap !w-full gap-3">
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            className="border-2 border-black dark "
          >
            TachySwap
          </Button>
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            className="border-2 border-black dark "
          >
            IguanaDEX
          </Button>
        </ScrollShadow>
      )}
      {selectedNetwork == "137" && (
        <ScrollShadow className="max-h-[150px] flex items-center flex-wrap !w-full gap-3">
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            className="border-2 border-black dark "
          >
            QuickSwap
          </Button>
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            className="border-2 border-black dark "
          >
            Uniswap
          </Button>
        </ScrollShadow>
      )}
      {selectedNetwork == "8453" && (
        <ScrollShadow className="max-h-[150px] flex items-center flex-wrap !w-full gap-3">
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            className="border-2 border-black dark "
          >
            Aerodrome
          </Button>
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            className="border-2 border-black dark "
          >
            Uniswap
          </Button>
        </ScrollShadow>
      )}
      {selectedNetwork == "1116" && (
        <ScrollShadow className="max-h-[150px] flex items-center flex-wrap !w-full gap-3">
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            className="border-2 border-black dark "
          >
            Glyph Exchange
          </Button>
        </ScrollShadow>
      )}
      {selectedNetwork == "42161" && (
        <ScrollShadow className="max-h-[150px] flex items-center flex-wrap !w-full gap-3">
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            className="border-2 border-black dark "
          >
            Uniswap
          </Button>
        </ScrollShadow>
      )}
      {selectedNetwork == "56" && (
        <ScrollShadow className="max-h-[150px] flex items-center flex-wrap !w-full gap-3">
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            className="border-2 border-black dark "
          >
            Pancakeswap
          </Button>
        </ScrollShadow>
      )}
    </>
  );
};
