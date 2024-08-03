"use client";

import { Context } from "@/app/providers/Providers";
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
import nftAbi from "@/app/libraries/DegenerativeArtABI.json";
import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

export default function Token({ params }) {
  const { instance } = useContext(Context);
  const [mounted, setMounted] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [network, setNetwork] = useState(false);
  const [metadata, setMetadata] = useState("");
  const [owner, setOwner] = useState("");

  // extract network

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setFetching(true);
        const node = "https://node.mainnet.etherlink.com";
        const provider = new ethers.JsonRpcProvider(node);
        const nftContract = new ethers.Contract(
          "0xcf552524772605de32dae649f7ced60a286b0d21",
          nftAbi,
          provider
        );
        const owner = await nftContract.ownerOf(params.tokenId);
        console.log("owner:", owner);
        setOwner(owner);
        const tokenURI = await nftContract.tokenURI(params.tokenId);
        const metadata = JSON.parse(atob(tokenURI?.split(",")[1]));
        console.log("metadata:", metadata);
        setMetadata(metadata);
        setFetching(false);
      } catch (error) {
        console.log(error);
        setFetching(false);
      }
    };
    fetchMetadata();
  }, []);

  return (
    <main className="flex items-center justify-center w-screen min-h-screen bg-black">
      {metadata ? (
        <div className="relative w-full">
          <iframe src={metadata?.animation_url} className="w-screen h-screen" />
          <span className="absolute top-4 left-4"></span>

          <div className="absolute flex justify-center w-full top-8">
            <div className="flex flex-col items-center justify-center p-3 rounded-full w-fit">
              <h1 className="flex gap-3 text-xl font-medium text-center text-white md:text-3xl">
                <Link href="/" className="">
                  <svg
                    className="overflow-hidden"
                    width="35"
                    height="36"
                    viewBox="0 0 35 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M30.1959 6.21804L20.7425 0.895891C19.7425 0.318403 18.413 0 16.9994 0C15.5861 0 14.2566 0.31802 13.2585 0.893978L3.92684 6.22187C1.76155 7.47099 0 10.36 0 12.6611V23.3131C0 25.6058 1.77341 28.494 3.95976 29.7554L13.4135 35.0775C14.4139 35.655 15.7433 35.9734 17.157 35.9734C18.5703 35.9734 19.8998 35.6554 20.8975 35.0794L30.2303 29.7516C32.3952 28.5021 34.1568 25.6138 34.1568 23.3131V12.6611C34.1564 10.3684 32.3826 7.47979 30.1959 6.21804ZM32.7029 23.3131C32.7029 25.0892 31.2081 27.5093 29.5066 28.4906L20.1738 33.8188C19.4019 34.2643 18.3021 34.5199 17.157 34.5199C16.0112 34.5199 14.9118 34.2643 14.1333 33.8146L4.67961 28.4925C2.9613 27.5009 1.45348 25.0804 1.45348 23.3131V12.6611C1.45348 10.885 2.94867 8.46409 4.65052 7.48286L13.9822 2.15458C14.7545 1.70912 15.8539 1.45348 16.9994 1.45348C18.1448 1.45348 19.2443 1.70912 20.0223 2.15879L29.476 7.48094C31.1951 8.47289 32.7029 10.8934 32.7029 12.6611V23.3131Z"
                      fill="white"
                    />
                    <path
                      d="M16.9719 22.9528C16.1609 22.6975 15.3003 22.7741 14.5475 23.1679C12.9949 23.9788 12.3906 25.9026 13.2004 27.4568L14.0056 27.0373C13.4273 25.9271 13.8586 24.5521 14.9681 23.9731C16.0779 23.3929 17.4533 23.8254 18.0339 24.9359L18.8387 24.515C18.4449 23.7618 17.7824 23.2073 16.9719 22.9528Z"
                      fill="white"
                    />
                    <path
                      d="M8.56216 18.8958C9.56568 18.8958 10.3792 18.0823 10.3792 17.0788C10.3792 16.0752 9.56568 15.2617 8.56216 15.2617C7.55863 15.2617 6.74512 16.0752 6.74512 17.0788C6.74512 18.0823 7.55863 18.8958 8.56216 18.8958Z"
                      fill="white"
                    />
                    <path
                      d="M21.452 13.8322C19.772 15.5195 18.6288 16.5038 16.3973 15.5229L15.666 17.1857C16.5458 17.573 17.3296 17.7349 18.0372 17.7349C18.5707 17.7349 19.0594 17.6419 19.5125 17.4846C19.6966 18.2921 20.4157 18.8956 21.2798 18.8956C22.284 18.8956 23.0964 18.0828 23.0964 17.0786C23.0964 16.4471 22.7742 15.8918 22.2859 15.5665C22.4409 15.415 22.592 15.2635 22.7398 15.115C24.465 13.3821 25.6042 12.2367 28.3639 14.1869L29.4121 12.7028C25.4003 9.86858 23.2109 12.0664 21.452 13.8322Z"
                      fill="white"
                    />
                  </svg>
                </Link>{" "}
                degenerative.art #{params.tokenId}
              </h1>
              <Chip
                size="sm"
                variant="bordered"
                className="text-white border-none backdrop-blur-sm"
              >
                by {owner}
              </Chip>
            </div>
          </div>
          {/* <div className="absolute flex justify-center w-full bottom-6">
            <div className="p-3 w-fit">
              {metadata?.emojis && (
                <div className="flex flex-wrap items-end justify-center w-full gap-2 px-6">
                  {metadata?.emojis.map((emoji, i) => (
                    <div
                      className="flex items-center justify-center duration-200 rounded-full border-small backdrop-blur-md border-white/20 bg-default-100/20 aspect-square"
                      key={i}
                    >
                      <span className="p-3 text-3xl duration-200 cursor-pointer hover:text-4xl">
                        {emoji}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div> */}

          {/* <div className="absolute bottom-0 grid p-4">
            {metadata?.tokenURI?.image && (
              <Card
                isFooterBlurred
                className="w-full group opacity-50 hover:opacity-100 transition-opacity !duration-1000 h-full max-w-[320px] md:h-[200px] col-span-12 sm:col-span-5 backdrop-blur-sm bg-transparent hover:bg-white/30"
              >
                <CardHeader className="absolute top-0 z-10 flex-col items-start"></CardHeader>
                <Image
                  removeWrapper
                  alt="NFT Image"
                  className="z-0 object-cover w-full h-full aspect-square"
                  src={metadata?.tokenURI?.image}
                />
                <CardFooter className="absolute bottom-0 z-10 justify-between duration-200 bg-white/10 group-hover:bg-white/50 border-t-1 border-zinc-100/10 group-hover:border-zinc-100/40">
                  <div>
                    <p className="text-sm font-semibold text-black">
                      <Link href="/">degeneratives.art</Link> #{params.tokenId}
                    </p>
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
          </div> */}
        </div>
      ) : (
        <Spinner />
      )}
    </main>
  );
}
