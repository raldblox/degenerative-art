"use client";

import { Context } from "@/app/(providers)/EthereumProvider";
import { useContext, useState } from "react";

export default function Token({ params }) {
  const { provider, signer } = useContext(Context);
  
  return <div className="p-16">{params.tokenId}</div>;
}
