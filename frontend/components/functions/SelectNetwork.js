import { networks } from "@/libraries/network";
import { Context } from "@/providers/Providers";
import { Avatar, Select, SelectItem } from "@nextui-org/react";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";

export const SelectNetwork = () => {
  const { selectedNetwork, setSelectedNetwork } = useContext(Context);

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

  return (
    <>
      <Select
        radius="sm"
        selectedKeys={
          selectedNetwork.length > 0 ? [selectedNetwork] : ["42793"]
        }
        onChange={handleSelectionChange}
        disallowEmptySelection
        selectionMode="single"
        items={networks}
        label="Select Supported Network"
        className="max-w-xs"
        variant="flat"
        classNames={{
          label: "group-data-[filled=true]:-translate-y-5 text-foreground",
          trigger: "min-h-20",
          listboxWrapper: "max-h-[450px]",
        }}
        listboxProps={{
          itemClasses: {
            base: [
              "rounded-md",
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
                <span>{item.data.chainName}</span>
                <span className="text-default-500 text-tiny">
                  ({item.data.nativeCurrency.symbol})
                </span>
              </div>
            </div>
          ));
        }}
      >
        {(chain) => (
          <SelectItem key={chain.chainId} textValue={chain.chainName}>
            <div className="flex items-center gap-2">
              <Avatar
                name={chain.nativeCurrency.symbol}
                className="flex-shrink-0 p-1 bg-black dark"
                size="sm"
                src={chain.icon}
                radius="sm"
              />
              <div className="flex flex-col">
                <span className="text-small">{chain.chainName}</span>
                <span className="text-tiny text-default-400">
                  {chain.nativeCurrency.symbol}
                </span>
              </div>
            </div>
          </SelectItem>
        )}
      </Select>
    </>
  );
};
