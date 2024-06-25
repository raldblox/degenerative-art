"use client";

import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Spinner,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Update({ params }) {
  const [mounted, setMounted] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [network, setNetwork] = useState(false);
  const [metadata, setMetadata] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  // extract network

  useEffect(() => {
    const network = searchParams.get("network");
    setNetwork(network);
    const fetchMetadata = async () => {
      if (!network && !params.tokenId) {
        return;
      }
      try {
        setFetching(true);
        const protocol =
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://www.degeneratives.art";
        const url = `${protocol}/api/getTokenURI/${network}/${params.tokenId}`;
        const data = await fetch(url).then((res) => res.json());
        setMetadata(data);
        console.log(data);
        setFetching(false);
      } catch (error) {
        console.log(error);
        setFetching(false);
      }
    };
    fetchMetadata();
    setMounted(true);
  }, [searchParams]);

  return <div>{params.tokenId}</div>;
}
