"use client";

import { Context } from "@/app/(providers)/EthereumProvider";
import { Image } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";

export default function Token({ params }) {
  const { provider, signer } = useContext(Context);
  const [metadata, setMetadata] = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setFetching(true);
        const protocol =
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://www.degeneratives.art";
        const url = `${protocol}/api/getTokenURI/${params.tokenId}`;
        const data = await fetch(url).then((res) => res.json());
        setMetadata(data.tokenURI);
        console.log(data);
        setFetching(false);
      } catch (error) {
        console.log(error);
        setFetching(false);
      }
    };
    fetchMetadata();
  }, []);

  const decodeHtml = (data) => {
    const decodedHtml = atob(data?.split(",")[1]);
    return decodedHtml;
  };

  return (
    <div className="relative">
      <iframe src={metadata?.animation_url} className="w-full h-screen" />
      <div className="absolute bottom-0 grid w-full grid-cols-4 p-4 ">
        <Image
          isLoading={fetching}
          src={metadata?.image}
          className="w-[100px] aspect-square backdrop-blur-sm"
          alt="NFT"
        />
      </div>
    </div>
  );
}
