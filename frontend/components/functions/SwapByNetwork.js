"use client";

import { Context } from "@/providers/Providers";
import { Button, ScrollShadow } from "@nextui-org/react";
import React, { useContext } from "react";

export const SwapByNetwork = () => {
  const { selectedNetwork } = useContext(Context);
  return (
    <>
      {selectedNetwork == "42793" && (
        <ScrollShadow className="max-h-[150px] grid grid-cols-2 !w-full gap-3">
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            fullWidth
            className="dark border-2 border-black h-[50px]"
          >
            TachySwap
          </Button>
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            fullWidth
            className="dark border-2 border-black h-[50px]"
          >
            IguanaDEX
          </Button>
        </ScrollShadow>
      )}
      {selectedNetwork == "137" && (
        <ScrollShadow className="max-h-[150px] grid grid-cols-2 !w-full gap-3">
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            fullWidth
            className="dark border-2 border-black h-[50px]"
          >
            QuickSwap
          </Button>
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            fullWidth
            className="dark border-2 border-black h-[50px]"
          >
            Uniswap
          </Button>
        </ScrollShadow>
      )}
      {selectedNetwork == "8453" && (
        <ScrollShadow className="max-h-[150px] grid grid-cols-2 !w-full gap-3">
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            fullWidth
            className="dark border-2 border-black h-[50px]"
          >
            Aerodrome
          </Button>
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            fullWidth
            className="dark border-2 border-black h-[50px]"
          >
            Uniswap
          </Button>
        </ScrollShadow>
      )}
      {selectedNetwork == "1116" && (
        <ScrollShadow className="max-h-[150px] grid grid-cols-2 !w-full gap-3">
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            fullWidth
            className="dark border-2 border-black h-[50px]"
          >
            Glyph Exchange
          </Button>
        </ScrollShadow>
      )}
      {selectedNetwork == "42161" && (
        <ScrollShadow className="max-h-[150px] grid grid-cols-2 !w-full gap-3">
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            fullWidth
            className="dark border-2 border-black h-[50px]"
          >
            Uniswap
          </Button>
        </ScrollShadow>
      )}
      {selectedNetwork == "56" && (
        <ScrollShadow className="max-h-[150px] grid grid-cols-2 !w-full gap-3">
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            fullWidth
            className="dark border-2 border-black h-[50px]"
          >
            Pancakeswap
          </Button>
        </ScrollShadow>
      )}
    </>
  );
};
