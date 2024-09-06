"use client";

import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Spinner,
  Switch,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import { useContext } from "react";
import { Context } from "../providers/Providers";
import { ethers } from "ethers";
import { useTheme } from "next-themes";
import { ThemeSwitcher } from "./ThemeSwitcher";
import DegenerativesID from "./TwitterAccount";
import { signIn, signOut, useSession } from "next-auth/react";

export const Navigation = ({ tabs }) => {
  const { connectEthereumWallet, userAddress, balances, fetching } = useContext(
    Context
  );
  const { data: session, status } = useSession();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Navbar
        maxWidth="2xl"
        className="z-50 h-[70px] bg-transparent backdrop-blur-sm"
      >
        <NavbarBrand>
          <Link href="/" className="md:pr-3">
            <svg
              className="h-8 text-foreground"
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
        <NavbarContent className="flex h-[50px] gap-1" justify="center">
          <NavbarItem className="backdrop-blur-sm">{tabs}</NavbarItem>
          <NavbarItem className="md:hidden">
            <Button
              size="sm"
              color="primary"
              variant="solid"
              radius="full"
              className="font-bold"
              onClick={onOpen}
            >
              {userAddress ? "Account" : "Connect"}
            </Button>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent
          className="items-center hidden gap-3 md:flex"
          justify="end"
        >
          {userAddress && (
            <>
              <NavbarItem>
                <Button
                  size="sm"
                  color="primary"
                  variant="bordered"
                  radius="full"
                  className="font-bold transition-all duration-200 border-small animate-appearance-in"
                >
                  {parseFloat(ethers.formatEther(balances.mood)).toFixed(2)}{" "}
                  MOOD
                </Button>
              </NavbarItem>
              <NavbarItem>
                <Button
                  as={Link}
                  href={`https://explorer.etherlink.com/token/0x5F440745E21D2F0388F7360586e8d92a9058BccC?tab=inventory&holder_address_hash=${userAddress}`}
                  isExternal
                  size="sm"
                  color="primary"
                  variant="bordered"
                  radius="full"
                  className="font-bold transition-all duration-200 border-small animate-appearance-in"
                >
                  {balances.nft.toString()} NFT
                </Button>
              </NavbarItem>
            </>
          )}

          <Dropdown placement="bottom-end" className="">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={session?.user ? session?.user.name : ""}
                size="sm"
                src={session?.user.image}
              />
            </DropdownTrigger>

            <DropdownMenu
              aria-label="Profile Actions"
              className=""
              variant="flat"
            >
              <DropdownItem
                key="profile"
                className="flex flex-row gap-2"
                variant="light"
              >
                <p className="text-lg font-semibold">
                  gm,{" "}
                  <span className="font-semibold">
                    {session?.user ? session?.user.name : "ser"}
                  </span>
                </p>
              </DropdownItem>
              {/* {session?.user && userAddress && (
                <DropdownItem color="primary" key="settings">
                  <span className="flex items-center gap-2">
                    degeneratives.id{" "}
                    <svg
                      className="h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M4 14v6h6v-2H6v-4z" fill="currentColor" />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M9 9v6h6V9zm4 2h-2v2h2z"
                        fill="currentColor"
                      />
                      <path
                        d="M4 10V4h6v2H6v4zm16 0V4h-6v2h4v4zm0 4v6h-6v-2h4v-4z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </DropdownItem>
              )} */}
              <DropdownItem onClick={onOpen} color="warning">
                {userAddress ? (
                  <>
                    {userAddress.slice(0, 7)}...{userAddress.slice(-5)}
                  </>
                ) : (
                  "Connect Wallet"
                )}
              </DropdownItem>

              {session?.user ? (
                <DropdownItem
                  showDivider
                  key="logout"
                  color="danger"
                  className="text-danger"
                  onClick={() => {
                    signOut("twitter");
                  }}
                >
                  Sign out X/Twitter
                </DropdownItem>
              ) : (
                <DropdownItem
                  showDivider
                  key="logout"
                  color="success"
                  onClick={() => {
                    signIn("twitter");
                  }}
                >
                  Connect X/Twitter
                </DropdownItem>
              )}

              <DropdownItem className="" variant="light">
                <ThemeSwitcher />
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="sm"
        className="p-6 !tracking-normal border-4 border-background bg-default-100"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader
                className="flex flex-col gap-1 text-2xl text-center"
                onClick={connectEthereumWallet}
              >
                {userAddress ? "Account connected" : "  Connect your account"}
              </ModalHeader>
              <ModalBody className="grid gap-3">
                <Button radius="full" variant="solid" color="warning">
                  {userAddress ? (
                    <>
                      {userAddress.slice(0, 7)}...{userAddress.slice(-7)}
                    </>
                  ) : (
                    "Connect Metamask Wallet"
                  )}
                </Button>
                {/* <Divider />
                <DegenerativesID />

                <Button radius="full" variant="solid" color="primary">
                  Create <span className="">degeneratives.id</span> (soon)
                </Button> */}
              </ModalBody>
              <ModalFooter className="flex justify-center w-full gap-2"></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export const MoonIcon = (props) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
      fill="currentColor"
    />
  </svg>
);

export const SunIcon = (props) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <g fill="currentColor">
      <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
      <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
    </g>
  </svg>
);
