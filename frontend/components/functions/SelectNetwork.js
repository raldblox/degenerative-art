import { networks } from "@/libraries/network";
import { Context } from "@/providers/Providers";
import { Avatar, Select, SelectItem } from "@nextui-org/react";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { LinkPreview } from "./LinkPreview";
import { LockIcon } from "../icons/BasicIcons";

export const SelectNetwork = () => {
  const {
    selectedNetwork,
    setSelectedNetwork,
    selectedChain,
    setSelectedChain,
  } = useContext(Context);

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

  useEffect(() => {
    const reloadPageOnNetworkChange = async () => {
      try {
        if (window.ethereum) {
          // ethereum.on("chainChanged", handleChainChanged);
          // function handleChainChanged() {
          //   window.location.reload();
          // }

          const chain = await window.ethereum.request({
            method: "eth_chainId",
          });

          const chainId = parseInt(chain, 16);

          const network = networks.find(
            (chain) => chain.chainId === Number(chainId)
          );

          if (network) {
            setSelectedNetwork(network.chainId.toString());
          } else {
            console.error("Network not found for chain ID:", chainId);
            return;
          }
        }
      } catch (error) {
        console.error("Error switching network:", error);
      }
    };

    reloadPageOnNetworkChange();
  }, [selectedNetwork, setSelectedNetwork]);

  return (
    <>
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
        label="Select Supported Network"
        className="max-w-md"
        variant="flat"
        classNames={{
          label:
            "group-data-[filled=true]:-translate-y-5 text-black font-semibold",
          trigger: "min-h-20",
          listboxWrapper: "max-h-[400px]",
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
                <span
                  className={`font-semibold ${
                    item.data.isTestnet && "text-default-700"
                  }`}
                >
                  {item.data.chainName}
                </span>
                <span className="text-default-700 text-tiny">
                  ({item.data.nativeCurrency.symbol})
                </span>
              </div>
            </div>
          ));
        }}
      >
        {(chain) => (
          <SelectItem
            color={chain.isTestnet ? "warning" : "default"}
            key={chain.chainId}
            textValue={chain.chainName}
            isReadOnly={!chain.isLive}
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
                  <LinkPreview
                    className={`font-semibold text-small ${
                      chain.isTestnet && "text-default-500"
                    }`}
                    url={chain?.site}
                  >
                    {chain.chainName}
                  </LinkPreview>
                  <span className="text-tiny text-default-700">
                    {chain.nativeCurrency.symbol}
                  </span>
                </div>
              </div>
              <div>{!chain.isLive && <LockIcon />}</div>
            </div>
          </SelectItem>
        )}
      </Select>
    </>
  );
};
