"use client";

import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Image,
  Spinner,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Token({ params }) {
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

  return (
    <main className="flex items-center justify-center w-screen min-h-screen">
      {mounted ? (
        <div className="relative w-full">
          <iframe
            src={metadata?.tokenURI?.animation_url}
            className="w-full h-screen"
          />
          <div className="absolute bottom-0 grid p-4">
            {metadata?.tokenURI?.image && (
              <Card
                isFooterBlurred
                className="w-full opacity-50 hover:opacity-100 transition-opacity !duration-1000 h-full max-w-[320px] md:h-[200px] col-span-12 sm:col-span-5 backdrop-blur-sm bg-transparent hover:bg-white/30"
              >
                <CardHeader className="absolute z-10 flex-col items-start top-1">
                  <p className="text-xs font-bold uppercase text-white/60">
                    TOKEN#{params.tokenId}
                  </p>
                  {/* <h4 className="font-medium text-white text-LG">POLYGON</h4> */}
                </CardHeader>
                <Image
                  removeWrapper
                  alt="NFT Image"
                  className="z-0 object-cover w-full h-full p-4 aspect-square"
                  src={metadata?.tokenURI?.image}
                />
                <CardFooter className="absolute bottom-0 z-10 justify-between bg-white/30 border-t-1 border-zinc-100/40">
                  <div>
                    <p className="text-black text-tiny">degeneratives.art</p>
                    <p className="text-black text-tiny">
                      by {metadata?.owner?.slice(0, 6)}...{" "}
                      {metadata?.owner?.slice(-4)}
                    </p>
                  </div>
                  <Button
                    className="text-tiny"
                    color="primary"
                    radius="full"
                    size="sm"
                    as={Link}
                    href={`https://testnets.opensea.io/assets/amoy/0x79f3557b73f89df0e54a6d5b71d63fd098ed6af4/${params.tokenId}`}
                    isIconOnly
                  >
                    <svg
                      className="h-5"
                      viewBox="0 0 360 360"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#a)">
                        <g clip-path="url(#b)">
                          <path
                            d="M252.072 212.292c-6.246 8.37-19.386 22.266-26.694 22.266h-33.966v-22.284h27.054c3.87 0 7.56-1.566 10.224-4.32 13.896-14.4 21.924-31.536 21.924-49.914 0-31.356-23.436-59.076-59.22-75.78V67.284c0-6.444-5.22-11.664-11.664-11.664s-11.664 5.22-11.664 11.664v6.21a191 191 0 0 0-31.734-6.444c18.36 19.944 29.574 46.62 29.574 75.87 0 26.226-8.964 50.31-24.03 69.39h26.19v22.32h-38.34a9.39 9.39 0 0 1-9.396-9.396v-9.756a3.115 3.115 0 0 0-3.114-3.114H66.672c-.99 0-1.836.81-1.836 1.8-.036 39.924 31.554 69.894 69.336 69.894h106.65c25.56 0 36.99-32.76 51.966-53.604 5.814-8.064 19.764-14.544 23.994-16.344.774-.324 1.224-1.044 1.224-1.89v-12.96c0-1.314-1.296-2.304-2.574-1.944 0 0-61.65 14.166-62.37 14.364-.72.216-.99.63-.99.63z"
                            fill="#0086FF"
                          />
                          <path
                            d="M146.16 142.83c0-20.106-6.894-38.61-18.414-53.244L69.732 189.972h62.406c8.874-13.536 14.04-29.736 14.04-47.124z"
                            fill="#0086FF"
                          />
                          <path
                            d="M181.566 0C80.91-.828-.828 80.91 0 181.566c.846 97.74 80.694 177.606 178.416 178.416 100.656.864 182.43-80.91 181.566-181.566C359.172 80.712 279.306.846 181.566 0m-53.82 89.586c11.52 14.634 18.414 33.156 18.414 53.244 0 17.406-5.166 33.606-14.04 47.124H69.714l58.014-100.386zm190.26 109.656v12.96c0 .846-.45 1.566-1.224 1.89-4.23 1.8-18.18 8.28-23.994 16.344-14.976 20.844-26.406 53.604-51.966 53.604h-106.65c-37.764 0-69.354-29.97-69.336-69.894 0-.99.846-1.8 1.836-1.8h50.544a3.104 3.104 0 0 1 3.114 3.114v9.756a9.39 9.39 0 0 0 9.396 9.396h38.34v-22.32h-26.19c15.066-19.08 24.03-43.164 24.03-69.39 0-29.25-11.214-55.926-29.574-75.87a192 192 0 0 1 31.734 6.444v-6.21c0-6.444 5.22-11.664 11.664-11.664s11.664 5.22 11.664 11.664v14.976c35.784 16.704 59.22 44.424 59.22 75.78 0 18.396-8.046 35.514-21.924 49.914a14.22 14.22 0 0 1-10.224 4.32h-27.054v22.284h33.966c7.326 0 20.466-13.896 26.694-22.266 0 0 .27-.414.99-.63s62.37-14.364 62.37-14.364c1.296-.36 2.574.63 2.574 1.944z"
                            fill="#fff"
                          />
                        </g>
                      </g>
                      <defs>
                        <clipPath id="a">
                          <path fill="#fff" d="M0 0h360v360H0z" />
                        </clipPath>
                        <clipPath id="b">
                          <path fill="#fff" d="M0 0h360v360H0z" />
                        </clipPath>
                      </defs>
                    </svg>
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </main>
  );
}
