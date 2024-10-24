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
  Tooltip,
  useDisclosure,
  User,
} from "@nextui-org/react";
import {
  ExploreIcon,
  HomeIcon,
  LockIcon,
  MetamaskIcon,
  SearchIcon,
  TwitterIcon,
  WalletIcon,
} from "../icons/BasicIcons";
import { DegenerativesLogo } from "../icons/DegenerativesLogo";
import { useContext, useEffect, useState } from "react";
import { Context } from "@/providers/Providers";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export default function Navigation() {
  const {
    setSelectedNavTab,
    selectedNavTab,
    connectEthereumWallet,
    connectedAccount,
    setConnectedAccount,
  } = useContext(Context);

  const [path, setPath] = useState("");

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const url = pathname;
    setPath(url);
  }, [pathname]);

  return (
    <Navbar
      isBordered
      maxWidth="full"
      // shouldHideOnScroll
      className="!p-0 border-none h-18"
    >
      <NavbarBrand className="!p-0 !m-0">
        <DegenerativesLogo />
      </NavbarBrand>

      <NavbarContent
        className="!p-0 !m-0 items-center justify-center"
        justify="center"
      >
        <NavbarItem>
          <Tabs
            fullWidth
            radius="sm"
            size="lg"
            variant="underlined"
            color="primary"
            aria-label="Options"
            selectedKey={selectedNavTab}
            onSelectionChange={setSelectedNavTab}
          >
            {path == "/" && (
              <Tab
                key="feels"
                title={
                  <div className="flex items-center space-x-2">
                    <ExploreIcon />
                    <span>Feels</span>
                  </div>
                }
              />
            )}
            {path == "/" && (
              <Tab
                key="home"
                title={
                  <div className="flex items-center space-x-2">
                    <HomeIcon />
                    <span>Home</span>
                  </div>
                }
              />
            )}
            {connectedAccount && (
              <Tab
                className="hidden md:flex"
                key="assets"
                title={
                  <div className="flex items-center space-x-2">
                    <WalletIcon />
                    <span>My Assets</span>
                  </div>
                }
              />
            )}
            {path == "/bridge" && <Tab key="bridge" title="Portal" />}
            {path == "/portal" && <Tab key="reward" title="Reward" />}

            {/* <Tab key="games" title="Games" isDisabled/> */}
          </Tabs>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent
        as="div"
        className="flex items-center justify-center"
        justify="end"
      >
        {!connectedAccount && (
          <NavbarItem className="hidden md:block">
            <Button
              size="sm"
              variant="solid"
              color="default"
              onClick={connectEthereumWallet}
              startContent={<MetamaskIcon />}
            >
              Connect
            </Button>
          </NavbarItem>
        )}

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
              <span className="hidden text-xs font-semibold text-primary md:hidden">
                {session?.user ? session?.user.name.split(" ")[0] : "Anonymous"}
              </span>
            }
            description={
              <div className="items-center hidden gap-2 text-xs font-semibold md:flex group-hover:text-default-600">
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

          {connectedAccount && (
            <DropdownItem
              className="block md:hidden"
              key="connect"
              color="primary"
              href={`/user/${connectedAccount}`}
            >
              My Assets
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
