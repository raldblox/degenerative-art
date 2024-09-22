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
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { SearchIcon } from "../icons/BasicIcons";
import { DegenerativesLogo } from "../icons/DegenerativesLogo";

export default function Navigation() {
  return (
    <Navbar isBordered maxWidth="full" className="h-18">
      <NavbarContent justify="start">
        <NavbarContent
          as="div"
          justify="left"
          className="flex items-center justify-center gap-2"
        >
          <NavbarItem>
            <NavbarBrand className="pr-6">
              <DegenerativesLogo />
              <p className="hidden text-lg font-bold sm:block text-inherit">
                degeneratives
              </p>
            </NavbarBrand>
          </NavbarItem>
          <NavbarItem>
            <Button
              radius="full"
              variant="flat"
              color="primary"
              href="#"
              size="sm"
              className="font-bold"
            >
              explore
            </Button>
          </NavbarItem>
          <NavbarItem isActive>
            <Button
              radius="full"
              variant="flat"
              color="primary"
              href="#"
              size="sm"
              className="font-bold"
            >
              mint
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              radius="full"
              variant="flat"
              color="primary"
              href="#"
              size="sm"
              className="font-bold"
            >
              bridge
            </Button>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>

      {/* <NavbarContent
        as="div"
        justify="center"
        className="items-center justify-center hidden gap-3 px-6 sm:flex"
      >
        <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page" color="secondary">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent> */}

      <NavbarContent as="div" className="items-center" justify="end">
        <Input
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
        />
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="success"
              name="Ser"
              size="sm"
              src=""
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="gap-2 h-14">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">Anonymous</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem key="analytics">Analytics</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
