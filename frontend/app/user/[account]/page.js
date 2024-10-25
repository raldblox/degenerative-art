"use client";

import { networks } from "@/libraries/network";
import { Context } from "@/providers/Providers";
import { Button, Image, Link, Spinner } from "@nextui-org/react";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";

export default function Account({ params }) {
  const { moodArtABI } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [userNFTs, setUserNFTs] = useState([]);

  const fetchUserTokens = async () => {
    if (!params.account) {
      return;
    }

    try {
      setLoading(true);
      const getLiveNetworks = () => {
        return networks
          .filter((network) => network.isLive)
          .map((network) => network.rpcUrls[0]);
      };

      const liveNetworkUrls = getLiveNetworks();
      const providers = liveNetworkUrls.map(
        (rpcUrl) => new ethers.JsonRpcProvider(rpcUrl)
      );

      const instances = networks
        .filter((network) => network.isLive)
        .map(
          (network, index) =>
            new ethers.Contract(
              network.contracts?.moodArt,
              moodArtABI,
              providers[index]
            )
        );

      setUserNFTs([]);

      for (let i = 0; i < instances.length; i++) {
        const nftContract = instances[i];
        const network = networks[i];

        try {
          const balanceOf = await nftContract.balanceOf(params.account);
          console.log(`balanceOf on ${network.chainName}:`, balanceOf);

          if (balanceOf > 0) {
            for (let index = 0; index < Number(balanceOf); index++) {
              const tokenId = await nftContract.tokenOfOwnerByIndex(
                params.account,
                index
              );

              console.log(
                `Fetching tokenId ${tokenId} on ${network.chainName}`
              );

              const emojis = await nftContract.getMood(tokenId);

              // Push directly to userNFTs and update state
              setUserNFTs((prevUserNFTs) => {
                // Check if the NFT already exists in the array
                const existingNFT = prevUserNFTs.find(
                  (nft) =>
                    nft.chainName === network.chainName &&
                    nft.tokenId === tokenId.toString()
                );

                if (!existingNFT) {
                  // Only add the NFT if it doesn't already exist
                  return [
                    ...prevUserNFTs,
                    {
                      chainName: network.chainName,
                      tokenId: tokenId.toString(),
                      owner: params.account,
                      emojis,
                    },
                  ];
                } else {
                  return prevUserNFTs; // Return the array unchanged
                }
              });
            }
          }
        } catch (error) {
          console.error(
            `Error fetching tokens on ${network.chainName}:`,
            error
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTokens();
  }, [params.account]);

  return (
    <section className="min-h-[calc(100vh-130px)] p-6 flex items-center justify-center">
      <div className="grid gap-6 pb-12 lg:grid-cols-3 md:grid-cols-2">
        {userNFTs?.map((token) => (
          <div
            key={token.tokenId}
            className="relative grid p-2 duration-200 border-2 shadow-md border-background bg-default-100 hover:shadow rounded-3xl"
          >
            <div className="grid w-full p-6 duration-300 bg-background group-hover:shadow rounded-2xl aspect-square animate-appearance-in">
              <div
                style={{
                  gridTemplateColumns: `repeat(${Math.sqrt(
                    token?.emojis.length
                  )}, 1fr)`,
                }}
                className={`grid gap-[2px]  border-2 text-xl mx-auto text-center md:text-[2.3rem] content-center items-center justify-center rounded-xl w-fit border-transparent duration-300 group-hover:border-white`}
              >
                {Object.values(token?.emojis).map((emoji, index) => (
                  <div
                    key={index}
                    style={{
                      width: `${
                        window.innerWidth > 600
                          ? 250 / Math.sqrt(token?.emojis.length)
                          : 200 / Math.sqrt(token?.emojis.length)
                      }px`,
                      fontSize: `${
                        window.innerWidth > 600
                          ? 150 / Math.sqrt(token?.emojis.length)
                          : 100 / Math.sqrt(token?.emojis.length)
                      }px`,
                    }}
                    className={`flex items-center justify-center w-8 leading-none tracking-tighter border-1 border-transparent duration-300 group-hover:border-white aspect-square`}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between w-full pt-2">
              <div className="flex flex-col items-start justify-between w-full px-2 text-xs text-foreground">
                <div className="flex items-center justify-between w-full font-semibold">
                  <p>degeneratives.art #{token.tokenId}</p>
                  <p>{token?.network}</p>
                </div>
                <div className="flex items-center gap-2">
                  {token.tokenId < 1039 && <UpdateToken token={token} />}
                </div>
              </div>
              <Button
                as={Link}
                isExternal
                href={`https://explorer.etherlink.com/token/0x5F440745E21D2F0388F7360586e8d92a9058BccC/instance/${token?.tokenId}`}
                radius="full"
                variant="light"
                className="flex items-center p-0"
                isIconOnly
              >
                <Image
                  src="/etherlink_icon.svg"
                  height={25}
                  width={75}
                  radius="none"
                />
              </Button>
              <Button
                as={Link}
                isExternal
                href={`https://rarible.com/token/etherlink/0x5F440745E21D2F0388F7360586e8d92a9058BccC:${token?.tokenId}`}
                radius="full"
                variant="light"
                className="flex items-center p-0"
                isIconOnly
              >
                <Image
                  src="/rarible_icon.svg"
                  height={20}
                  width={75}
                  radius="none"
                />
              </Button>
            </div>

            {/* <div className="flex items-center justify-between gap-3">
              <Button size="sm" radius="full" className="text-sm">
                UPDATE
              </Button>
              <Button size="sm" radius="full" className="text-sm">
                EVOLVE
              </Button>
            </div> */}
          </div>
        ))}
        {loading && (
          <div className="">
            <Spinner size="sm" />
          </div>
        )}

        {!loading && userNFTs.length == 0 && (
          <div className="flex flex-col items-center justify-center space-y-6 text-center md:col-span-3">
            <p className="text-2xl">No tokens found</p>
            <Button
              size="md"
              radius="full"
              variant="solid"
              color="default"
              className="text-white transition-all duration-300 bg-black w-fit"
              onClick={() => setSelectedTab("home")}
            >
              Mint your feels today
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
