"use client";

import { LockIcon } from "@/components/icons/BasicIcons";
import { networks } from "@/libraries/network";
import { Context } from "@/providers/Providers";
import {
  Avatar,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import React, { useContext, useState } from "react";

export default function Bridge() {
  const {
    selectedNetwork,
    setSelectedNetwork,
    selectedChain,
    setSelectedChain,
  } = useContext(Context);

  const [destinationNetwork, setDestinationNetwork] = useState(new Set([]));

  const handleSelectionChange = async (e) => {
    const chainId = Number(e.target.value);
    setSelectedNetwork(chainId.toString());

    const selectedChain = networks.find((chain) => chain.chainId === chainId);
    const correctedChainId = `0x${chainId.toString(16)}`;
    console.log(selectedChain);

    const correctedSelectedChain = {
      chainId: correctedChainId,
      chainName: selectedChain.chainName,
      rpcUrls: selectedChain.rpcUrls,
      nativeCurrency: selectedChain.nativeCurrency,
      blockExplorerUrls: selectedChain.blockExplorerUrls,
    };

    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: correctedChainId }],
        });
        setSelectedNetwork(chainId.toString());
      } catch (switchError) {
        if (switchError.code === 4902) {
          // Network not added to MetaMask
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [correctedSelectedChain], // Pass the selectedChain object
            });
          } catch (addError) {
            console.error("Error adding network:", addError);
          }
          setSelectedNetwork(chainId.toString());
        } else {
          setSelectedNetwork([]);
          console.error("Error switching network:", switchError);
        }
      }
    }
  };

  const handleDestinationChange = async (e) => {
    const chainId = Number(e.target.value);
    setDestinationNetwork(chainId.toString());
  };

  return (
    <div className="flex-grow flex-col min-h-[calc(100vh-130px)] flex justify-center items-center p-3">
      <div className="flex flex-col items-start w-full max-w-lg gap-6 p-6 bg-white rounded-3xl">
        <div className="w-full py-3 text-3xl font-semibold text-center lowercase">
          Bridge Your MOOD
        </div>
        <div className="flex flex-wrap items-start w-full h-full gap-3 mx-auto md:flex-nowrap max-h-lg">
          <Select
            radius="sm"
            selectedKeys={
              selectedNetwork.length > 0 ? [selectedNetwork] : ["42793"]
            }
            // selectedKeys={[selectedNetwork]}
            onChange={handleSelectionChange}
            disallowEmptySelection
            selectionMode="single"
            items={networks}
            label="Source"
            className=""
            variant="flat"
            description={<span className="text-default-500">Balance: --</span>}
            classNames={{
              label:
                "group-data-[filled=true]:-translate-y-5 text-black font-semibold",
              trigger: "min-h-20 ",
              listboxWrapper: "max-h-[400px]",
            }}
            listboxProps={{
              itemClasses: {
                base: [
                  "rounded-md ",
                  "text-foreground",
                  "transition-opacity",
                  "data-[hover=true]:text-foreground",
                  "data-[hover=true]:bg-default-400",
                  "dark:data-[hover=true]:bg-default-200",
                  "data-[selectable=true]:focus:bg-default-200",
                  "data-[pressed=true]:opacity-70",
                  "data-[focus-visible=true]:ring-default-500",
                ],
              },
            }}
            popoverProps={{
              classNames: {
                base: "before:bg-default-200",
                content: "p-0 border-small border-divider bg-background",
              },
            }}
            renderValue={(items) => {
              return items.map((item) => (
                <div key={item.key} className="flex items-center gap-2">
                  <Avatar
                    name={item.data.nativeCurrency.symbol}
                    // alt={item.data.chainName}
                    className="flex-shrink-0 p-1 bg-black dark"
                    size="sm"
                    src={item.data.icon}
                    radius="sm"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">{item.data.chainName}</span>
                  </div>
                </div>
              ));
            }}
          >
            {(chain) => (
              <SelectItem
                key={chain.chainId}
                textValue={chain.chainName}
                isReadOnly={!chain.hasBridge}
                endContent={!chain.hasBridge && <LockIcon />}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar
                      name={chain.nativeCurrency.symbol}
                      className="flex-shrink-0 p-1 bg-black dark"
                      size="sm"
                      src={chain.icon}
                      radius="sm"
                    />
                    <div className="flex flex-col">
                      <span className="text-tiny text-default-700">
                        {chain.chainName}
                      </span>
                    </div>
                    <div></div>
                  </div>
                </div>
              </SelectItem>
            )}
          </Select>
          <Select
            radius="sm"
            selectedKeys={
              destinationNetwork.length > 0 ? [destinationNetwork] : ["1116"]
            }
            // selectedKeys={[selectedNetwork]}
            onChange={handleDestinationChange}
            description={<span className="text-default-500">Balance: --</span>}
            disallowEmptySelection
            selectionMode="single"
            items={networks}
            label="Destination"
            className=""
            variant="flat"
            classNames={{
              label:
                "group-data-[filled=true]:-translate-y-5 text-black font-semibold",
              trigger: "min-h-20 ",
              listboxWrapper: "max-h-[400px]",
            }}
            listboxProps={{
              itemClasses: {
                base: [
                  "rounded-md ",
                  "text-foreground",
                  "transition-opacity",
                  "data-[hover=true]:text-foreground",
                  "data-[hover=true]:bg-default-400",
                  "dark:data-[hover=true]:bg-default-200",
                  "data-[selectable=true]:focus:bg-default-200",
                  "data-[pressed=true]:opacity-70",
                  "data-[focus-visible=true]:ring-default-500",
                ],
              },
            }}
            popoverProps={{
              classNames: {
                base: "before:bg-default-200",
                content: "p-0 border-small border-divider bg-background",
              },
            }}
            renderValue={(items) => {
              return items.map((item) => (
                <div key={item.key} className="flex items-center gap-2">
                  <Avatar
                    name={item.data.nativeCurrency.symbol}
                    // alt={item.data.chainName}
                    className="flex-shrink-0 p-1 bg-black dark"
                    size="sm"
                    src={item.data.icon}
                    radius="sm"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">{item.data.chainName}</span>
                  </div>
                </div>
              ));
            }}
          >
            {(chain) => (
              <SelectItem
                key={chain.chainId}
                textValue={chain.chainName}
                isReadOnly={!chain.hasBridge}
                endContent={!chain.hasBridge && <LockIcon />}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar
                      name={chain.nativeCurrency.symbol}
                      className="flex-shrink-0 p-1 bg-black dark"
                      size="sm"
                      src={chain.icon}
                      radius="sm"
                    />
                    <div className="flex flex-col">
                      <span className="text-tiny text-default-700">
                        {chain.chainName}
                      </span>
                    </div>
                    <div></div>
                  </div>
                </div>
              </SelectItem>
            )}
          </Select>
        </div>
        <div className="w-full">
          <Input
            color="default"
            radius="sm"
            size="lg"
            type="number"
            // label="Token Supply"
            placeholder="0.00"
            labelPlacement="inside"
            endContent={
              <div className="flex items-center pointer-events-none">
                <span className="text-2xl font-semibold text-default-400">
                  MOOD
                </span>
              </div>
            }
            classNames={{
              inputWrapper: "!h-[80px] !w-full",
              input: "text-3xl font-semibold",
            }}
          />
        </div>
        <div className="w-full mt-6">
          <Button
            fullWidth
            size="lg"
            color="primary"
            variant="solid"
            className=""
            endContent={<LockIcon />}
          >
            SEND
          </Button>
        </div>
      </div>
    </div>
  );
}
