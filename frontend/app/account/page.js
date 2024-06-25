"use client";

import React, { useContext, useEffect } from "react";
import { Context } from "../(providers)/EthereumProvider";
import {
  Button,
  Card,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Skeleton,
} from "@nextui-org/react";
import EmojisContainer from "../(components)/EmojisContainer";
import { Navigation } from "../(components)/Navigation";
import { AssetLoader } from "../(components)/loader/AssetLoader";

export default function Account() {
  const {
    userTokens,
    updateEmoji,
    countdown,
    connectEthereumProvider,
    userAddress,
    fetching,
  } = useContext(Context);

  const handleUpdate = (tokenId) => {
    updateEmoji(tokenId, [
      "😡",
      "😠",
      "🤬",
      "😤",
      "💢",
      "💥",
      "😡",
      "😠",
      "🤬",
    ]);
  };

  useEffect(() => {
    connectEthereumProvider();
  }, [connectEthereumProvider]);

  return (
    <div>
      <Navbar
        maxWidth="2xl"
        className="z-50 h-[70px] bg-transparent backdrop-blur-none"
      >
        <NavbarBrand>
          <Link href="/" className="md:px-3">
            <svg
              className="h-8 text-black"
              viewBox="0 0 35 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M30.1959 6.21804L20.7425 0.895891C19.7425 0.318403 18.413 0 16.9994 0C15.5861 0 14.2566 0.31802 13.2585 0.893978L3.92684 6.22187C1.76155 7.47099 0 10.36 0 12.6611V23.3131C0 25.6058 1.77341 28.494 3.95976 29.7554L13.4135 35.0775C14.4139 35.655 15.7433 35.9734 17.157 35.9734C18.5703 35.9734 19.8998 35.6554 20.8975 35.0794L30.2303 29.7516C32.3952 28.5021 34.1568 25.6138 34.1568 23.3131V12.6611C34.1564 10.3684 32.3826 7.47979 30.1959 6.21804ZM32.7029 23.3131C32.7029 25.0892 31.2081 27.5093 29.5066 28.4906L20.1738 33.8188C19.4019 34.2643 18.3021 34.5199 17.157 34.5199C16.0112 34.5199 14.9118 34.2643 14.1333 33.8146L4.67961 28.4925C2.9613 27.5009 1.45348 25.0804 1.45348 23.3131V12.6611C1.45348 10.885 2.94867 8.46409 4.65052 7.48286L13.9822 2.15458C14.7545 1.70912 15.8539 1.45348 16.9994 1.45348C18.1448 1.45348 19.2443 1.70912 20.0223 2.15879L29.476 7.48094C31.1951 8.47289 32.7029 10.8934 32.7029 12.6611V23.3131Z"
                fill="currentColor"
              />
              <path
                d="M16.9719 22.9528C16.1609 22.6975 15.3003 22.7741 14.5475 23.1679C12.9949 23.9788 12.3906 25.9026 13.2004 27.4568L14.0056 27.0373C13.4273 25.9271 13.8586 24.5521 14.9681 23.9731C16.0779 23.3929 17.4533 23.8254 18.0339 24.9359L18.8387 24.515C18.4449 23.7618 17.7824 23.2073 16.9719 22.9528Z"
                fill="currentColor"
              />
              <path
                d="M8.56216 18.8958C9.56568 18.8958 10.3792 18.0823 10.3792 17.0788C10.3792 16.0752 9.56568 15.2617 8.56216 15.2617C7.55863 15.2617 6.74512 16.0752 6.74512 17.0788C6.74512 18.0823 7.55863 18.8958 8.56216 18.8958Z"
                fill="currentColor"
              />
              <path
                d="M21.452 13.8322C19.772 15.5195 18.6288 16.5038 16.3973 15.5229L15.666 17.1857C16.5458 17.573 17.3296 17.7349 18.0372 17.7349C18.5707 17.7349 19.0594 17.6419 19.5125 17.4846C19.6966 18.2921 20.4157 18.8956 21.2798 18.8956C22.284 18.8956 23.0964 18.0828 23.0964 17.0786C23.0964 16.4471 22.7742 15.8918 22.2859 15.5665C22.4409 15.415 22.592 15.2635 22.7398 15.115C24.465 13.3821 25.6042 12.2367 28.3639 14.1869L29.4121 12.7028C25.4003 9.86858 23.2109 12.0664 21.452 13.8322Z"
                fill="currentColor"
              />
            </svg>
          </Link>
        </NavbarBrand>
        <NavbarContent className="flex h-[50px]" justify="center">
          <NavbarItem className="backdrop-blur-sm">
            {countdown !== "00:00:00" && (
              <p className="mx-auto text-lg font-semibold">{countdown}</p>
            )}
          </NavbarItem>
        </NavbarContent>
        <NavbarContent
          className="items-center hidden gap-1 sm:flex"
          justify="end"
        >
          <NavbarItem className="pr-2">
            <Button
              as={userAddress && Link}
              href="/account"
              size="sm"
              color="foreground"
              variant="bordered"
              radius="full"
              className="font-bold border-small bg-default-100"
              onClick={connectEthereumProvider}
            >
              {userAddress ? userAddress.slice(0, 6) : "connect"}
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="flex flex-col items-center justify-center space-y-6 md:p-16">
        <h1 className="text-4xl text-center lowercase text-pretty">
          my tokens
        </h1>
        <ul className="grid gap-6 p-6 mx-auto md:grid-cols-3">
          {fetching && userAddress ? (
            // Display loaders while fetching
            <>
              <AssetLoader />
              <AssetLoader />
              <AssetLoader />
            </>
          ) : (
            // Display tokens or "No tokens found" message after fetching
            <>
              {userTokens.length !== 0 ? (
                userTokens.map((token) => (
                  <Link
                    href={`/id/${token.tokenId}?network=${token.network}`}
                    key={token.tokenId}
                    className="flex flex-col items-center justify-center p-2 duration-200 border-2 border-white shadow-md bg-default-100 hover:shadow rounded-3xl"
                  >
                    <div className="p-6 duration-300 bg-white group-hover:shadow rounded-2xl">
                      <EmojisContainer token={token} />
                    </div>
                    <div className="flex flex-col items-start justify-between w-full px-2 pt-3 pb-1 text-xs text-black">
                      <div className="flex items-center justify-between w-full font-semibold">
                        <p>degeneratives.art #{token.tokenId}</p>
                        <p>{token?.network}</p>
                      </div>
                      <div>
                        <p>
                          {token.owner.slice(0, 5)}
                          ...
                          {token.owner.slice(-4)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-start w-full gap-1 mt-2">
                      <Button radius="full" size="sm" onClick={handleUpdate}>
                        update
                      </Button>
                      <Button radius="full" size="sm">
                        stake
                      </Button>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="md:col-span-3">
                  <p className="text-lg text-center whitespace-nowrap">
                    nothing to see here
                  </p>
                </div>
              )}
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
