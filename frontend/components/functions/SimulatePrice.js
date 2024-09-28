"use client";

import { Button } from "@nextui-org/react";
import React from "react";

export const SimulatePrice = () => {
  return (
    <>
      <Button
        variant="flat"
        color="primary"
        size="sm"
        className="text-xs font-semibold uppercase cursor-pointer w-fit"
      >
        Simulate Price
      </Button>
    </>
  );
};
