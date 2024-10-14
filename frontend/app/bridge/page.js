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
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";

export default function Bridge() {
  const {
    selectedNetwork,
    setSelectedNetwork,
    selectedChain,
    setSelectedChain,
    connectedAccount,
    connectEthereumWallet,
    bridgeABI,
    wrappedERC0ABI,
  } = useContext(Context);

  const [sourceNetwork, setSourceNetwork] = useState("128123");
  const [destinationNetwork, setDestinationNetwork] = useState("1115");

  const [sourceChain, setSourceChain] = useState(null);
  const [destinationChain, setDestinationChain] = useState(null);

  const [sourceERC20Instance, setSourceERC20Instance] = useState(null);
  const [destinationERC20Instance, setDestinationERC20Instance] = useState(
    null
  );

  const [sourceERC20Balance, setSourceERC20Balance] = useState(0);
  const [destinationERC20Balance, setDestinationERC20Balance] = useState(0);

  const [tokenAmount, setTokenAmount] = useState(0);

  const [loading, setLoading] = useState(false);

  const handleSourceChange = async (e) => {
    const chainId = e ? Number(e.target.value) : Number(sourceNetwork);
    setSourceNetwork(chainId.toString());

    const selectedChain = networks.find((chain) => chain.chainId === chainId);
    const correctedChainId = `0x${chainId.toString(16)}`;

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
        setSourceNetwork(chainId.toString());
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
          setSourceNetwork(chainId.toString());
        } else {
          setSourceNetwork([]);
          console.error("Error switching network:", switchError);
        }
      }
    }
  };

  const handleDestinationChange = async (e) => {
    const chainId = Number(e.target.value);
    setDestinationNetwork(chainId.toString());
  };

  const handleSend = async (e) => {
    try {
      if (loading) {
        return;
      }
      if (!connectedAccount) {
        await connectEthereumWallet();
      }
      // Check if contract instances are available
      if (!sourceERC20Instance || !destinationERC20Instance) {
        throw new Error("Contract instances not available yet.");
      }

      const sourceBalance = await sourceERC20Instance.balanceOf(
        connectedAccount
      );

      const destinationBalance = await destinationERC20Instance.balanceOf(
        connectedAccount
      );
    } catch (error) {
      console.error("Error getting balances:", error);
      // Consider displaying an error message to the user (e.g., using an alert or a toast notification)
      alert(`Error: ${error.message}`);
    }

    // get balance of account
  };

  useEffect(() => {
    const fetchAll = async () => {
      if (
        sourceNetwork &&
        destinationNetwork &&
        networks &&
        window.ethereum &&
        connectedAccount &&
        wrappedERC0ABI
      ) {
        try {
          setLoading(true);
          await handleSourceChange();
          const source = networks.find(
            (n) => n.chainId === Number(sourceNetwork)
          );
          setSourceChain(source);

          const destination = networks.find(
            (n) => n.chainId === Number(destinationNetwork)
          );
          setDestinationChain(destination);

          // get providers
          const sourceProvider = new ethers.BrowserProvider(window.ethereum);
          const signer = await sourceProvider.getSigner();
          const destinationProvider = new ethers.JsonRpcProvider(
            destination?.rpcUrls[0]
          );

          // get instances
          const sourceERC0 = new ethers.Contract(
            source?.contracts?.wrappedMOOD,
            wrappedERC0ABI,
            signer
          );

          const destinationERC0 = new ethers.Contract(
            destination?.contracts?.wrappedMOOD,
            wrappedERC0ABI,
            destinationProvider
          );

          setSourceERC20Instance(sourceERC0);
          setDestinationERC20Instance(destinationERC0);

          if (connectedAccount) {
            const sourceBalance = await sourceERC0.balanceOf(connectedAccount);

            const destinationBalance = await destinationERC0.balanceOf(
              connectedAccount
            );

            setSourceERC20Balance(ethers.formatEther(sourceBalance));
            setDestinationERC20Balance(ethers.formatEther(destinationBalance));
          }
        } catch (error) {
          console.warn("Error initializing contracts:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAll();
  }, [sourceNetwork, destinationNetwork, connectedAccount, wrappedERC0ABI]);

  // bridge plan
  // 1. lock token to etherlink
  // 2. burn it

  return (
    <div className="flex-grow flex-col min-h-[calc(100vh-130px)] flex justify-center items-center p-3">
      <div className="flex flex-col items-start w-full max-w-lg gap-6 p-6 bg-white rounded-3xl">
        <div className="w-full py-3 text-3xl font-semibold text-center lowercase">
          Bridge Your MOOD
        </div>
        <div className="flex flex-wrap items-start w-full h-full gap-3 mx-auto md:flex-nowrap max-h-lg">
          <Select
            radius="sm"
            selectedKeys={[sourceNetwork]}
            onChange={handleSourceChange}
            description={
              <span className="text-default-500">
                Balance: {sourceERC20Balance.toString()}
              </span>
            }
            disallowEmptySelection
            selectionMode="single"
            items={networks}
            label="Source"
            className=""
            variant="flat"
            classNames={{
              label:
                "group-data-[filled=true]:-translate-y-5 text-black font-semibold",
              trigger: "min-h-20 ",
              listboxWrapper: "max-h-[300px]",
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
            selectedKeys={[destinationNetwork]}
            onChange={handleDestinationChange}
            description={
              <span className="text-default-500">
                Balance: {destinationERC20Balance.toString()}
              </span>
            }
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
              listboxWrapper: "max-h-[300px]",
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
            value={tokenAmount}
            onChange={(e) => setTokenAmount(e.target.value)}
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
            isLoading={loading}
            isDisabled={loading}
            onClick={handleSend}
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
