"use client";

import { LockIcon } from "@/components/icons/BasicIcons";
import { networks } from "@/libraries/network";
import { aesEncrypt } from "@/providers/encryption";
import { Context } from "@/providers/Providers";
import {
  Avatar,
  BreadcrumbItem,
  Breadcrumbs,
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
    connectedAccount,
    setConnectedAccount,
    wrappedERC0ABI,
    bridgeABI,
    hexalanaEndpoint,
  } = useContext(Context);

  const [sourceNetwork, setSourceNetwork] = useState("128123");
  const [destinationNetwork, setDestinationNetwork] = useState("1115");

  const [sourceChain, setSourceChain] = useState(null);
  const [destinationChain, setDestinationChain] = useState(null);

  const [sourceERC20Instance, setSourceERC20Instance] = useState(null);
  const [destinationERC20Instance, setDestinationERC20Instance] = useState(
    null
  );
  const [sourceBridgeInstance, setSourceBridgeInstance] = useState(null);
  const [destinationBridgeInstance, setDestinationBridgeInstance] = useState(
    null
  );

  const [sourceERC20Balance, setSourceERC20Balance] = useState(0);
  const [destinationERC20Balance, setDestinationERC20Balance] = useState(0);

  const [tokenAmount, setTokenAmount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [bridging, setBridging] = useState(false);
  const [sourceHash, setSourceHash] = useState("");
  const [destinationHash, setDestinationHash] = useState("");

  const [currentStage, setCurrentStage] = useState("");

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
      if (bridging || loading) {
        return;
      }
      if (!connectedAccount) {
        throw new Error("No wallet connected");
      }
      // Check if contract instances are available
      if (!sourceERC20Instance || !destinationERC20Instance) {
        throw new Error("Contract instances not available yet.");
      }

      setBridging(true);

      // Convert tokenAmount to Wei
      const amountInWei = ethers.parseEther(tokenAmount.toString());

      // Check and approve allowance
      const allowance = await sourceERC20Instance.allowance(
        connectedAccount,
        sourceChain?.contracts?.hexalanaBridge
      );
      console.log(`allowance:${allowance}`);
      setCurrentStage("approving");

      if (amountInWei > allowance) {
        const approvalTx = await sourceERC20Instance.approve(
          sourceChain?.contracts?.hexalanaBridge,
          ethers.parseEther(sourceERC20Balance.toString())
        );
        await approvalTx.wait();
      }

      try {
        setCurrentStage("locking");
        const lockTx = await sourceBridgeInstance.lockTokens(
          process.env.NEXT_PUBLIC_MOOD,
          connectedAccount,
          amountInWei,
          Number(destinationNetwork)
        );

        await lockTx.wait();
        setSourceHash(lockTx.hash);
      } catch (error) {
        throw new Error("Locking error");
      }

      const data = {
        action: "bridge",
        sourceChain: Number(sourceNetwork),
        destinationChain: Number(destinationNetwork),
        sender: connectedAccount,
        receiver: connectedAccount,
        tokenAddress: process.env.NEXT_PUBLIC_MOOD,
        tokenAmount: Number(amountInWei),
      };

      const encryptedData = await aesEncrypt(data);
      console.log("encryptedData:", encryptedData);
      setCurrentStage("minting");
      try {
        const response = await fetch(hexalanaEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            encryptedData,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.message === "Success") {
            setDestinationHash(data.unlockTxhash);
            setCurrentStage("bridged");
          } else {
            alert(`Error: ${data.message}`);
            throw new Error(data.message || "Error on bridge");
          }
        } else {
          throw new Error("Bridge unsuccessful");
        }
      } catch (error) {
        throw new Error("Bridge unsuccessful");
      }
    } catch (error) {
      setBridging(false);
      console.error("ERROR:", error.message);
    } finally {
      setBridging(false);
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
            source?.contracts?.MOOD,
            wrappedERC0ABI,
            signer
          );

          const sourceBridge = new ethers.Contract(
            source?.contracts?.hexalanaBridge,
            bridgeABI,
            signer
          );

          const destinationERC0 = new ethers.Contract(
            destination?.contracts?.MOOD,
            wrappedERC0ABI,
            destinationProvider
          );

          const destinationBridge = new ethers.Contract(
            destination?.contracts?.hexalanaBridge,
            bridgeABI,
            destinationProvider
          );

          setSourceERC20Instance(sourceERC0);
          setSourceBridgeInstance(sourceBridge);
          setDestinationERC20Instance(destinationERC0);
          setDestinationBridgeInstance(destinationBridge);

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
  }, [
    sourceNetwork,
    destinationNetwork,
    connectedAccount,
    wrappedERC0ABI,
    bridging,
  ]);

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        // Disconnected
        setConnectedAccount(null);
      } else if (accounts[0] !== connectedAccount) {
        // Wallet address changed
        setConnectedAccount(accounts[0]);
        window.location.reload(); // Reload the page
      }
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, [connectedAccount]);

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
            max={Number(sourceERC20Balance)}
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
            isInvalid={tokenAmount > Number(sourceERC20Balance)}
            errorMessage="Insufficient MOOD Balance"
          />
        </div>
        <div className="w-full mt-6">
          <Button
            isLoading={loading || bridging}
            isDisabled={loading || bridging}
            onClick={handleSend}
            fullWidth
            size="lg"
            color="primary"
            variant="solid"
            className="h-[70px] text-xl font-semibold"
            // endContent={<LockIcon />}
          >
            {bridging ? "BRIDGING" : "BRIDGE"}
          </Button>
        </div>
      </div>
      <div className="py-3">
        <Breadcrumbs
          underline="none"
          size="sm"
          color=""
          variant="solid"
          classNames={{
            list: "bg-transparent",
          }}
          itemClasses={{
            item: [
              "px-2 py-0.5 border-small border-default-400 rounded-small",
              "data-[current=true]:bg-primary data-[current=true]:text-white transition-colors",
              "data-[disabled=true]:border-default-400 data-[disabled=true]:bg-default-100",
            ],
            separator: "",
          }}
        >
          <BreadcrumbItem
            key="approved"
            isCurrent={currentStage === "approving"}
          >
            Approve
          </BreadcrumbItem>
          <BreadcrumbItem key="locked" isCurrent={currentStage === "locking"}>
            Lock
          </BreadcrumbItem>
          <BreadcrumbItem key="minted" isCurrent={currentStage === "minting"}>
            Mint
          </BreadcrumbItem>
          <BreadcrumbItem key="bridged" isCurrent={currentStage === "bridged"}>
            Done
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
    </div>
  );
}
