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
  Link,
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
    moodEndpoint,
  } = useContext(Context);

  const [sourceNetwork, setSourceNetwork] = useState("128123");
  const [destinationNetwork, setDestinationNetwork] = useState("1115");

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

      setSourceHash("");
      setDestinationHash("");

      setBridging(true);
      await handleSourceChange();

      const source = networks.find((n) => n.chainId === Number(sourceNetwork));
      console.log(source?.contracts?.MOOD, source?.contracts?.hexalanaBridge);

      // get providers
      const sourceProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await sourceProvider.getSigner();
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

      console.log(source?.contracts?.MOOD, source?.contracts?.hexalanaBridge);

      // Convert tokenAmount to Wei
      const amountInWei = ethers.parseEther(tokenAmount.toString());

      // Check and approve allowance
      const allowance = await sourceERC0.allowance(
        connectedAccount,
        source?.contracts?.hexalanaBridge
      );
      console.log(`allowance:${allowance}`);
      setCurrentStage("approving");

      if (amountInWei > allowance) {
        const approvalTx = await sourceERC0.approve(
          source?.contracts?.hexalanaBridge,
          ethers.parseEther(sourceERC20Balance.toString())
        );
        await approvalTx.wait();
      }

      try {
        setCurrentStage("locking");
        const lockTx = await sourceBridge.lockTokens(
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
      setCurrentStage("encrypting");
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

  function Receipts() {
    const source = networks.find((n) => n.chainId === Number(sourceNetwork));
    const destination = networks.find(
      (n) => n.chainId === Number(destinationNetwork)
    );
    return (
      <div className="flex flex-wrap items-center justify-center gap-1">
        {sourceHash && (
          <Link
            size="sm"
            color="foreground"
            isExternal
            href={`${source.blockExplorerUrls[0]}/tx/${sourceHash}`}
          >
            Source TxReceipt
          </Link>
        )}
        <span>--</span>
        {destinationHash && (
          <Link
            size="sm"
            color="foreground"
            isExternal
            href={`${destination.blockExplorerUrls[0]}/tx/${destinationHash}`}
          >
            Destination TxReceipt
          </Link>
        )}
      </div>
    );
  }

  useEffect(() => {
    const fetchAll = async () => {
      if (sourceNetwork && destinationNetwork && connectedAccount) {
        try {
          setLoading(true);
          try {
            const response = await fetch(moodEndpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                connectedAccount,
                sourceNetwork,
                destinationNetwork,
              }),
            });

            if (response.ok) {
              const data = await response.json();
              console.log(data);
              setSourceERC20Balance(data.sourceBalance);
              setDestinationERC20Balance(data.destinationBalance);
            } else {
              throw new Error("Fetch unsuccessful");
            }
          } catch (error) {
            throw new Error("Fetch unsuccessful");
          }
        } catch (error) {
          console.warn("Error initializing contracts:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAll();
  }, [connectedAccount, bridging, sourceNetwork, destinationNetwork]);

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

  const handleSwitch = () => {
    setSourceNetwork(destinationNetwork);
    setDestinationNetwork(sourceNetwork);
  };

  return (
    <div className="flex-grow flex-col min-h-[calc(100vh-130px)] flex justify-center items-center p-3">
      <div className="flex flex-col items-start w-full max-w-lg gap-6 p-6 bg-white rounded-3xl">
        <div className="w-full py-3 text-3xl font-semibold text-center lowercase">
          Bridge Your MOOD
        </div>
        <div className="flex flex-wrap items-center w-full h-full gap-3 mx-auto md:flex-nowrap max-h-lg">
          <Select
            radius="sm"
            selectedKeys={sourceNetwork ? [sourceNetwork] : ["128123"]}
            onChange={handleSourceChange}
            description={
              <span className="text-default-500">
                Balance: {parseFloat(sourceERC20Balance).toFixed(5).toString()}
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
          <Button
            onClick={handleSwitch}
            isDisabled={loading || bridging}
            variant="light"
            className=""
            isIconOnly
            size="sm"
            startContent={
              <svg
                width="12"
                height="12"
                viewBox="0 0 1024 1024"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M118.656 438.656a32 32 0 0 1 0-45.248L416 96l4.48-3.776A32 32 0 0 1 461.248 96l3.712 4.48a32.064 32.064 0 0 1-3.712 40.832L218.56 384H928a32 32 0 1 1 0 64H141.248a32 32 0 0 1-22.592-9.344M64 608a32 32 0 0 1 32-32h786.752a32 32 0 0 1 22.656 54.592L608 928l-4.48 3.776a32.064 32.064 0 0 1-40.832-49.024L805.632 640H96a32 32 0 0 1-32-32" />
              </svg>
            }
          ></Button>
          <Select
            radius="sm"
            selectedKeys={[destinationNetwork]}
            onChange={handleDestinationChange}
            description={
              <span className="text-default-500">
                Balance:{" "}
                {parseFloat(destinationERC20Balance).toFixed(5).toString()}
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
            min={0}
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
            isLoading={bridging}
            isDisabled={bridging}
            onClick={handleSend}
            fullWidth
            size="lg"
            color="primary"
            variant="solid"
            className="h-[60px] text-xl font-semibold"
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
            list: "bg-transparent gap-y-2 items-center justify-center",
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
          <BreadcrumbItem
            key="encrypted"
            isCurrent={currentStage === "encrypting"}
          >
            Encrypt
          </BreadcrumbItem>
          <BreadcrumbItem key="minted" isCurrent={currentStage === "minting"}>
            Mint
          </BreadcrumbItem>
          <BreadcrumbItem key="bridged" isCurrent={currentStage === "bridged"}>
            Done
          </BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <div>
        <Receipts />
      </div>
    </div>
  );
}
