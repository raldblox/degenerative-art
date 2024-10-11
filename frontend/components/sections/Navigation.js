"use client";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
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
  Tab,
  Tabs,
  useDisclosure,
  User,
} from "@nextui-org/react";
import {
  LockIcon,
  MetamaskIcon,
  SearchIcon,
  TwitterIcon,
} from "../icons/BasicIcons";
import { DegenerativesLogo } from "../icons/DegenerativesLogo";
import { useContext } from "react";
import { Context } from "@/providers/Providers";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navigation() {
  const {
    setSelectedNavTab,
    selectedNavTab,
    connectEthereumWallet,
    connectedAccount,
    setConnectedAccount,
  } = useContext(Context);

  return (
    <Navbar
      hid
      isBordered
      maxWidth="full"
      // shouldHideOnScroll
      className="border-none h-18"
    >
      <NavbarContent justify="start">
        <NavbarContent
          as="div"
          justify="left"
          className="flex items-center justify-center gap-2"
        >
          <NavbarItem className="">
            <NavbarBrand className="pr-3">
              <DegenerativesLogo />
            </NavbarBrand>
          </NavbarItem>
          <NavbarItem>
            <Tabs
              radius="sm"
              size="sm"
              variant="light"
              color="primary"
              aria-label="Options"
              selectedKey={selectedNavTab}
              onSelectionChange={setSelectedNavTab}
            >
              <Tab key="feels" title="Feels" />
              <Tab key="home" title="Home" />
              {/* <Tab key="games" title="Games" isDisabled/> */}
            </Tabs>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="end">
        {/* <Input
          classNames={{
            base: "max-w-full sm:max-w-[12rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
          className="hidden md:flex"
        /> */}
        <Account />
      </NavbarContent>
    </Navbar>
  );
}

export function Account() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    connectEthereumWallet,
    connectedAccount,
    setConnectedAccount,
  } = useContext(Context);
  const { data: session, status } = useSession();

  return (
    <>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <User
            name={
              <span className="text-xs font-semibold text-primary">
                {session?.user ? session?.user.name.split(" ")[0] : "Anonymous"}
              </span>
            }
            description={
              <div className="flex items-center gap-2 text-xs font-semibold group-hover:text-default-600">
                Account
              </div>
            }
            avatarProps={{
              src: session?.user.image,
            }}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          {connectedAccount ? (
            <DropdownItem
              key="profile"
              className=""
              startContent={<MetamaskIcon />}
            >
              <p className="font-bold">
                {connectedAccount?.slice(0, 6)}...
                {connectedAccount?.slice(-6)}
              </p>
            </DropdownItem>
          ) : (
            <DropdownItem
              color="warning"
              key="profile"
              className=""
              onClick={connectEthereumWallet}
              startContent={<MetamaskIcon />}
            >
              <p className="font-semibold">Connect Metamask</p>
            </DropdownItem>
          )}

          <DropdownItem
            key="connect"
            onClick={() => {
              signIn("twitter");
            }}
            color="primary"
            startContent={<TwitterIcon />}
          >
            {session?.user ? "Connected" : "Connect X/Twitter"}
          </DropdownItem>

          <DropdownItem
            key="settings"
            // onClick={onOpen}
            startContent={<LockIcon />}
            color="secondary"
          >
            Smart Account
          </DropdownItem>

          {/* <DropdownItem key="configurations">Configurations</DropdownItem>
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem> */}
          {session?.user && (
            <DropdownItem
              key="logout"
              color="danger"
              onClick={() => {
                setConnectedAccount("");
                signOut("twitter");
              }}
            >
              Log Out
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>

      <Modal
        size="md"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        // isDismissable={false}
        isKeyboardDismissDisabled={true}
        className="p-6 pb-0"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl text-center">
                Smart Account
              </ModalHeader>
              <ModalBody>
                {connectedAccount ? (
                  <>
                    <Button size="lg" startContent={<MetamaskIcon />}>
                      {connectedAccount?.slice(0, 6)}...
                      {connectedAccount?.slice(-6)}
                    </Button>
                  </>
                ) : (
                  <Button size="lg" onClick={connectEthereumWallet}>
                    Connect Metamask
                  </Button>
                )}

                <Button
                  size="lg"
                  onClick={() => {
                    signIn("twitter");
                  }}
                >
                  Login with X/Twitter
                </Button>
              </ModalBody>
              <ModalFooter className="flex justify-center">
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
