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
  Tab,
  Tabs,
} from "@nextui-org/react";
import { SearchIcon } from "../icons/BasicIcons";
import { DegenerativesLogo } from "../icons/DegenerativesLogo";
import { useContext } from "react";
import { Context } from "@/providers/Providers";

export default function Navigation() {
  const { setSelectedNavTab, selectedNavTab } = useContext(Context);

  return (
    <Navbar isBordered maxWidth="full" className="h-18">
      <NavbarContent justify="start">
        <NavbarContent
          as="div"
          justify="left"
          className="flex items-center justify-center gap-2"
        >
          <NavbarItem className="">
            <NavbarBrand className="pr-6">
              <DegenerativesLogo />
              <p className="hidden text-xl font-bold md:flex text-inherit">
                degeneratives
              </p>
            </NavbarBrand>
          </NavbarItem>
          <NavbarItem>
            <Tabs
              radius="sm"
              size="md"
              variant="light"
              color="primary"
              aria-label="Options"
              selectedKey={selectedNavTab}
              onSelectionChange={setSelectedNavTab}
            >
              <Tab key="feels" title="Explore Feels" />
              <Tab key="dashboard" title="Dashboard" />
              <Tab key="games" title="Games" />
            </Tabs>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>

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
