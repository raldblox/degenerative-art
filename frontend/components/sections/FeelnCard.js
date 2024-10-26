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
      <Card className="w-full h-full shadow-sm bg-default-100 !rounded-2xl light border-white border-2 min-h-[70vh]">
        <CardHeader className=" z-10 absolute top-0 flex-col md:flex-row !items-start flex justify-between border-none shadow-none !rounded-none drop-shadow-none px-3 w-full">
          <div className="grid gap-1 md:gap-2">
            <Link
              showAnchorIcon
              color="foreground"
              isExternal
              href={`/id/${post?.tokenId.toString()}/?network=${post.chainName.toLowerCase()}`}
              className="font-semibold text-small text-default-700"
            >
              MOODART #{post?.tokenId.toString()}
            </Link>
          </div>
        </CardHeader>
        <CardBody className="top-0 flex items-center justify-center w-full h-full overflow-hidden text-4xl shadow-inner bg-default-100 group md:text-7xl">
          <div
            // onClick={() => {
            //   handleView(post?.tokenId);
            // }}
            className="pb-6 text-center w-fit group"
          >
            <span
              className={`absolute  hidden md:flex text-nowrap tracking-[-20rem] -translate-x-2/4 scale-150 leading-none text-center z-0 text-[30rem] transition-all duration-500 transform  text-black blur-md top-1/2 left-1/4 opacity-25 saturate-100`}
            >
              {Object.values(post.emojis).slice().reverse().join(" ")}
            </span>
            <span
              className={`absolute  hidden md:flex text-nowrap tracking-[-14rem] -translate-x-2/4 scale-150 leading-none text-center z-0 text-[25rem] transition-all duration-500 transform  text-white  -translate-y-3/4 blur-sm top-1/3 left-2/4 opacity-10 saturate-100`}
            >
              {Object.values(post.emojis).slice().reverse().join(" ")}
            </span>
            <span
              className={`absolute hidden md:flex invert text-nowrap tracking-[-20rem] -translate-x-2/4 scale-150 leading-none text-center z-0 text-[20rem] transition-all duration-500 transform  text-white -translate-y-1/4 top-1/2 left-1/4 opacity-10 saturate-100`}
            >
              {Object.values(post.emojis).slice().reverse().join(" ")}
            </span>

            <div
              style={{
                gridTemplateColumns: `repeat(${Math.sqrt(
                  post.emojis.length
                )}, 1fr)`,
              }}
              className={`grid p-3 text-xl mx-auto text-center content-center items-center justify-center rounded-xl w-fit  border-transparent duration-300 bg-white/50 `}
            >
              {Object.values(post.emojis).map((emoji, index) => (
                <div
                  key={index}
                  style={{
                    width: `${
                      window.innerWidth > 600
                        ? 320 / Math.sqrt(post.emojis.length)
                        : 250 / Math.sqrt(post.emojis.length)
                    }px`,
                    fontSize: `${
                      window.innerWidth > 600
                        ? 280 / Math.sqrt(post.emojis.length)
                        : 200 / Math.sqrt(post.emojis.length)
                    }px`,
                  }}
                  className={`flex items-center text-center justify-center w-8 leading-none tracking-[0] duration-300  aspect-square`}
                >
                  {emoji}
                </div>
              ))}
            </div>

            {/* <div className="absolute left-0 flex items-center gap-2 p-2 px-3 text-xs font-bold tracking-wider text-left uppercase transition-all duration-300 rounded-r-lg md:opacity-25 bg-default-700 text-default-200 bottom-3 md:group-hover:opacity-100">
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
            </div> */}
          </div>
        </CardBody>
        <CardFooter className="absolute bottom-0 z-10 items-center justify-between w-full gap-3 p-3 bg-white/50 border-t-1 border-zinc-100/50 md:p-3 backdrop-blur-sm">
          <Header chainName={post?.chainName} post={post} />
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
      <div className="flex items-center w-full gap-3">
        <Avatar isBordered radius="full" size="sm" src="" />
        <Link
          isExternal
          href={`/user/${post?.owner}`}
          className="flex flex-col items-start justify-center gap-1"
        >
          <h4 className="font-semibold leading-none text-small text-default-600">
            Anonymous
          </h4>
          <p className="tracking-tight text-small text-default-400">
            {post?.owner.slice(0, 7)}
          </p>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Marketplace
          chainName={post?.chainName}
          tokenId={post?.tokenId}
          post={post}
        />
      </div>
    </>
  );
};

const Marketplace = ({ chainName, tokenId }) => {
  const network = networks.find((chain) => chain.chainName === chainName);
  const id = tokenId ? tokenId : 0;

  return (
    <div className="flex items-center gap-2 rounded-lg min-w-[150px] justify-end">
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
              className="!h-7 scale-100 hover:scale-90"
              src={marketplace?.icon}
              alt={marketplace?.name}
            />
          </Link>
        );
      })}
      <Link
        isExternal
        href={`${network?.blockExplorerUrls[0]}/nft/${network?.contracts?.moodArt}/${tokenId}`}
        color="primary"
      >
        <Image
          radius="none"
          className="!h-7 !rounded-none hover:scale-90 scale-100 object-cover object-center"
          src={network?.icon}
          alt={network?.chainName}
        />
      </Link>
    </div>
  );
};
