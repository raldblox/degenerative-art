"use client";

import React, { useContext, useEffect, useState } from "react";
import nftAbi from "@/app/libraries/DegenerativeArtABI.json";
import { AssetLoader } from "./AssetLoader";
import { Button, Image, Link } from "@nextui-org/react";
import EmojisContainer from "./EmojisContainer";
import { Context } from "../providers/Providers";
import { ethers } from "ethers";

const AllFeels = () => {
  const { instance, userAddress } = useContext(Context);
  const [allAssets, setAllAssets] = useState(null);
  const [userTokens, setUserTokens] = useState(null);
  const [fetching, setFetching] = useState(false);

  const fetchTokens = async () => {
    try {
      setFetching(true);
      const node = "https://node.mainnet.etherlink.com";
      const provider = new ethers.JsonRpcProvider(node);
      const nftContract = new ethers.Contract(
        "0xa3c4e2C4772B879FD82Dd9a6735B4ee8a600B54F",
        nftAbi,
        provider
      );
      const totalSupply = await nftContract.totalSupply();
      console.log("totalSupply///", totalSupply);

      const promises = [];

      const randomTokenIds = [];

      while (
        randomTokenIds.length < 9 &&
        randomTokenIds.length < Number(totalSupply)
      ) {
        const randomId = Math.floor(Math.random() * Number(totalSupply)) + 1;
        if (!randomTokenIds.includes(randomId)) {
          randomTokenIds.push(randomId);
        }
      }

      for (const tokenId of randomTokenIds) {
        promises.push(
          (async () => {
            const owner = await nftContract.ownerOf(tokenId);
            const emojis = await nftContract.getEmojis(tokenId);
            console.log("Fetched", tokenId);

            return {
              tokenId: tokenId,
              owner,
              emojis,
            };
          })()
        );
      }

      const fetchedData = await Promise.all(promises);

      setAllAssets(fetchedData);

      if (userAddress) {
        const userTokensData = fetchedData.filter(
          (asset) => asset.owner.toLowerCase() === userAddress?.toLowerCase()
        );
        setUserTokens(userTokensData);
      }
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const handleRegenerate = () => {
    fetchTokens(); // Call fetchTokens to refresh the data
  };

  return (
    <>
      <ul className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
        {fetching ? (
          <>
            <AssetLoader />
            <AssetLoader />
            <AssetLoader />
            <AssetLoader />
            <AssetLoader />
            <AssetLoader />
            <AssetLoader />
            <AssetLoader />
            <AssetLoader />
          </>
        ) : (
          <>
            {allAssets?.map((token) => (
              <div
                // isExternal
                // href={`/id/${token.tokenId}`}
                key={token.tokenId}
                className="flex flex-col items-center justify-center p-2 duration-200 border-2 border-white shadow-md bg-default-100 hover:shadow rounded-3xl"
              >
                <div className="w-full p-6 duration-300 bg-white group-hover:shadow rounded-2xl">
                  <EmojisContainer token={token} />
                </div>
                <div className="flex items-center justify-between w-full pt-3 pb-2">
                  <div className="flex flex-col items-start justify-between w-full px-2 text-xs text-black">
                    <div className="flex items-center justify-between w-full font-semibold">
                      <p>degeneratives.art #{token.tokenId}</p>
                      <p>{token?.network}</p>
                    </div>
                    <div className="">
                      <p>
                        by {token.owner.slice(0, 5)}
                        ...
                        {token.owner.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <Button
                    as={Link}
                    isExternal
                    href={`https://explorer.etherlink.com/token/0xa3c4e2C4772B879FD82Dd9a6735B4ee8a600B54F/instance/${token?.tokenId}`}
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
                    href={`https://rarible.com/token/etherlink/0xa3c4e2C4772B879FD82Dd9a6735B4ee8a600B54F:${token?.tokenId}`}
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
              </div>
            ))}
          </>
        )}
      </ul>
      <div className="flex items-center justify-center w-full my-12">
        <Button
          size="sm"
          color="primary"
          radius="full"
          onClick={(e) => {
            handleRegenerate();
            window.scrollTo(0, 0);
          }}
        >
          regenerate
        </Button>
      </div>
    </>
  );
};

export default AllFeels;
