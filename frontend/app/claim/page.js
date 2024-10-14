"use client";

import { Image } from "@nextui-org/react";
import React from "react";

export default function Claim() {
  return (
    <section className="min-h-[calc(100vh-130px)] p-6 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full ">
        <Image width={300} src="/soon.svg" />
        <p className="w-full text-sm text-center uppercase">
          Under Construction
        </p>
      </div>
    </section>
  );
}
