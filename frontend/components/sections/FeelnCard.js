"use client";

import { networks } from "@/libraries/network";
import { Context } from "@/providers/Providers";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Link,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";

export const FeelnCard = ({ post }) => {
  const route = useRouter();
  const handleView = (id) => {
    route.push(`/id/${id}`);
  };
  return (
    <>
      <Card className="w-full h-full border shadow-sm bg-default-100 !rounded-2xl light ">
        <CardHeader className="relative flex items-center justify-between bg-white border-none shadow-none !rounded-none drop-shadow-none md:px-6 py-4">
          <Header chainName={post?.chainName} post={post} />
        </CardHeader>

        <CardBody className="relative flex items-center justify-center w-full h-full overflow-hidden text-4xl bg-white shadow-inner group md:text-7xl">
          <div
            // onClick={() => {
            //   handleView(post?.tokenId);
            // }}
            className="p-8 text-center w-fit group"
          >
            <span
              className={`absolute invert text-nowrap tracking-[-14rem] -translate-x-2/4 scale-150 leading-none text-center z-0 text-[25rem] transition-all duration-500 transform  text-white -translate-y-1/2 top-1/2 left-2/4 opacity-10 saturate-100`}
            >
              {Object.values(post.emojis).slice().reverse().join(" ")}
            </span>

            <div
              style={{
                gridTemplateColumns: `repeat(${Math.sqrt(
                  post.emojis.length
                )}, 1fr)`,
              }}
              className={`grid gap-[2px]  border-2 text-xl mx-auto text-center md:text-[2.3rem] content-center items-center justify-center rounded-xl w-fit border-transparent duration-300 group-hover:border-white`}
            >
              {Object.values(post.emojis).map((emoji, index) => (
                <div
                  key={index}
                  style={{
                    width: `${
                      window.innerWidth > 600
                        ? 350 / Math.sqrt(post.emojis.length)
                        : 250 / Math.sqrt(post.emojis.length)
                    }px`,
                    fontSize: `${
                      window.innerWidth > 600
                        ? 250 / Math.sqrt(post.emojis.length)
                        : 150 / Math.sqrt(post.emojis.length)
                    }px`,
                  }}
                  className={`flex items-center justify-center w-8 leading-none tracking-tighter border-1 border-transparent duration-300 group-hover:border-white aspect-square`}
                >
                  {emoji}
                </div>
              ))}
            </div>

            <div className="absolute left-0 flex items-center gap-2 p-2 px-3 text-xs font-bold tracking-wider text-left uppercase transition-all duration-300 rounded-r-lg md:opacity-25 bg-default-700 text-default-200 bottom-3 md:group-hover:opacity-100">
              <div className="grid leading-tight">
                <p className="">COLLECT</p>
                <p>THIS ON</p>
              </div>

              <span className="flex items-center">
                <Marketplace
                  chainName={post?.chainName}
                  tokenId={post?.tokenId}
                />
              </span>
            </div>
          </div>
        </CardBody>
        <CardFooter className="items-center !rounded-none justify-between w-full gap-3 p-3 bg-white md:p-6">
          <div className="grid gap-1 md:gap-2">
            <p className="font-semibold text-default-700 text-small">
              MOODART #{post?.tokenId.toString()}
            </p>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

const Header = ({ chainName, post }) => {
  //   const { data: session, status } = useSession();
  //   const { connectedAccount } = useContext(Context);
  const network = networks.find((chain) => chain.chainName === chainName);

  return (
    <>
      <div className="flex items-center w-full gap-5">
        <Avatar isBordered radius="full" size="sm" src="" />
        <div className="flex flex-col items-start justify-center gap-1">
          <h4 className="font-semibold leading-none text-small text-default-600">
            Anonymous
          </h4>
          <Link
            href={`${network?.blockExplorerUrls[0]}/address/${post?.owner}`}
            className="tracking-tight text-small text-default-400"
          >
            {post?.owner.slice(0, 7)}
          </Link>
        </div>
      </div>
      <Button
        isExternal
        as={Link}
        href={`${network?.blockExplorerUrls[0]}/nft/${network?.contracts?.moodArt}/${post.tokenId}`}
        color="default"
        radius="full"
        size="sm"
        variant="flat"
        startContent={<ChainIcon chainName={post?.chainName} />}
      >
        View
      </Button>
    </>
  );
};

const ChainIcon = ({ chainName }) => {
  const network = networks.find((chain) => chain.chainName === chainName);

  return (
    <Image
      width={20}
      className="w-16 h-16 !rounded-none"
      src={network?.icon}
      alt={network?.chainName}
    />
  );
};

const Marketplace = ({ chainName, tokenId }) => {
  const network = networks.find((chain) => chain.chainName === chainName);
  const id = tokenId ? tokenId : 0;

  return (
    <div className="flex items-center gap-1 rounded-full w-fit">
      {network?.marketplaces.map((marketplace, index) => {
        // Construct the marketplace URL based on its schema
        let marketplaceUrl;
        switch (marketplace.name) {
          case "Rarible":
            marketplaceUrl = `${
              marketplace.link
            }/${network.chainName.toLowerCase()}/${
              network.contracts.moodArt
            }:${id}`;
            break;
          case "Opensea":
            const chainNameForOpensea =
              network.chainName === "Polygon"
                ? "matic"
                : network.chainName.toLowerCase();
            marketplaceUrl = `${marketplace.link}/${chainNameForOpensea}/${network.contracts.moodArt}/${id}`;
            break;
          case "MagicEden":
            marketplaceUrl = `${
              marketplace.link
            }/${network.chainName.toLowerCase()}/${
              network.contracts.moodArt
            }/${id}`;
            break;
          case "YoungParrot":
            marketplaceUrl = `${marketplace.link}/${network.contracts.moodArt}/${id}`;
            break;
          default:
            marketplaceUrl = "#"; // Or handle the default case as needed
        }

        return (
          <Link key={index} isExternal href={marketplaceUrl} color="primary">
            <Image
              radius="none"
              width={22}
              className="w-6 h-6 hover:scale-125"
              src={marketplace?.icon}
              alt={marketplace?.name}
            />
          </Link>
        );
      })}
    </div>
  );
};
