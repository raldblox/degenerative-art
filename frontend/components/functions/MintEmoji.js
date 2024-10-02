"use client";

import { Context } from "@/providers/Providers";
import {
  Button,
  Image,
  Link,
  LinkIcon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Slider,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SelectNetwork } from "./SelectNetwork";
import { SimulatePrice } from "./SimulatePrice";
import { networks } from "@/libraries/network";
import { ethers } from "ethers";

export const MintEmoji = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    countdown,
    selectedNetwork,
    moodArtABI,
    connectEthereumWallet,
    connectedAccount,
    walletSigner,
    setSelectedChain,
    selectedChain,
    addToken,
    setSelectedNetwork,
  } = useContext(Context);

  const fieldsRef = useRef(null);
  const inputRef = useRef([]);
  const [inputValues, setInputValues] = useState(Array(9).fill(""));
  const [activeFields, setActiveFields] = useState(9);
  const [fetching, setFetching] = useState(false);
  const [minting, setMinting] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [expansionLevel, setExpansionLevel] = useState(2);

  const [price, setPrice] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [nftBalance, setNFTBalance] = useState(0);

  const handleMint = async () => {
    console.log("emojis:", inputValues);

    try {
      setMinting(true);
      setTxHash("");
      // Check for at least one filled input
      if (inputValues.every((value) => value === "")) {
        alert("Please fill in at least one input.");
        return;
      }

      // Check if wallet is connected
      if (!connectedAccount) {
        alert("Please connect your wallet first and try again.");
        await connectEthereumWallet();
        return;
      }

      // Fetch user's native token balance
      const provider = new ethers.BrowserProvider(window.ethereum);
      const nativeBalance = await provider.getBalance(connectedAccount);

      // Check network (assuming you have the desired network ID in a variable 'targetNetworkId')
      const network = await provider.getNetwork();
      console.log("chainid:", network.chainId);
      console.log("nativeBalance:", nativeBalance);

      if (Number(network.chainId) !== Number(selectedNetwork)) {
        alert("incorrect network. please switch to etherlink network.");
        return;
      }

      const moodArt = new ethers.Contract(
        selectedChain?.contracts?.moodArt,
        moodArtABI,
        walletSigner
      );

      const totalSupply_ = await moodArt.totalSupply();
      const price_ = await moodArt.price(totalSupply_);
      setTotalSupply(totalSupply_);
      setPrice(price_);

      // Check if the user has enough native tokens
      if (Number(nativeBalance) < Number(price_)) {
        alert("insufficient balance. please acquire more XTZ.");
        return;
      }

      const emojiHash = await moodArt.hash(inputValues);
      const taken = await moodArt.tokenized(emojiHash);

      // Check if the user has enough native tokens
      if (taken) {
        alert(`This mood pattern is already tokenized. Hash: ${emojiHash}`);
        return;
      }

      // Send transaction
      const tx = await moodArt.mint(
        connectedAccount,
        inputValues,
        1,
        true,
        0,
        "0x0000000000000000000000000000000000000000",
        {
          value: price_,
        }
      );

      if (tx.hash) {
        setTxHash(tx.hash);
      }
    } catch (error) {
      // Log error details
      console.error("Minting failed:", error);
      alert("Oops, something went wrong!");
    } finally {
      setMinting(false);
    }
  };

  const handleChange = (event, index) => {
    const value = event.target.value; // Ensure only one character
    setInputValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });

    if (index < activeFields - 1 && value.length > 0) {
      inputRef.current[index + 1].focus();
    } else if (
      index === activeFields - 1 &&
      value.length === 1 &&
      activeFields < 9
    ) {
      setActiveFields(activeFields + 1);
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyUp = (event, index) => {
    if (event.key === "Delete" || event.key === "Backspace") {
      if (index > 0) {
        inputRef.current[index - 1].focus();
      }
    }
  };

  const handleKeyDown = (event, focusedIndex) => {
    if (
      event.ctrlKey &&
      event.shiftKey &&
      event.altKey &&
      event.key.toLowerCase() === "e"
    ) {
      // Directly update the inputValues at the focusedIndex if it's empty
      if (focusedIndex !== null && inputValues[focusedIndex] === "") {
        setInputValues((prevValues) => {
          const newValues = [...prevValues];
          newValues[focusedIndex] = ":etherlink:";
          return newValues;
        });

        // Focus on the next input if available
        if (focusedIndex < 8) {
          inputRef.current[focusedIndex + 1].focus();
        }
      } else {
        // If no input is focused or the focused one is not empty,
        // find the first empty one and insert
        const nextEmptyIndex = inputValues.findIndex((value) => value === "");
        if (nextEmptyIndex !== -1) {
          setInputValues((prevValues) => {
            const newValues = [...prevValues];
            newValues[nextEmptyIndex] = ":etherlink:";
            return newValues;
          });

          if (nextEmptyIndex < 8) {
            inputRef.current[nextEmptyIndex + 1].focus();
          }
        }
      }
    }
  };

  const renderInputFields = () => {
    return (
      <>
        {inputValues.map((value, i) => (
          <>
            <div key={i} className="relative">
              <input
                data-emoji-input="unicode"
                key={i}
                size="lg"
                type="text"
                data-index={i}
                maxLength={2}
                onKeyDown={(e) => handleKeyDown(e, i)}
                ref={(el) => (inputRef.current[i] = el)}
                className={` w-24 h-24 placeholder:saturate-0 bg-default-50 text-2xl text-center rounded-md border-1 border-black/20 outline-none focus:border-primary ${
                  i >= activeFields ? "hidden" : ""
                }`}
                onChange={(e) => {
                  const value = e.target.value;
                  const validChar = value.match(
                    /(\p{Emoji_Presentation}|[^\s])/u
                  );
                  if (validChar) {
                    e.target.value = validChar[0];
                  } else {
                    e.target.value = "";
                  }
                  handleChange(e, i);
                }}
                onKeyUp={(e) => handleKeyUp(e, i)}
              />

              {value === ":etherlink:" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image src="./chain/etherlink.png" height={25} width={25} />
                </div>
              )}
            </div>
          </>
        ))}
      </>
    );
  };

  useEffect(() => {
    if (!fieldsRef.current) {
      return;
    }
    const elements = fieldsRef.current.children;
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = i < activeFields ? "block" : "none";
    }

    if (activeFields > 3 && inputRef.current[activeFields - 1]) {
      inputRef.current[activeFields - 1].focus();
    }
  }, [activeFields]);

  const handleSlider = (value) => {
    if (isNaN(Number(value))) return;
    setExpansionLevel(value);
  };

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        await connectEthereumWallet();

        setFetching(true);
        setTotalSupply(0);
        setPrice(0);
        const selectedChain = networks.find(
          (chain) => chain.chainId === Number(selectedNetwork)
        );
        setSelectedChain(selectedChain);
        const node = selectedChain.rpcUrls[0];
        const provider = new ethers.JsonRpcProvider(node);
        const moodArt = new ethers.Contract(
          selectedChain.contracts?.moodArt,
          moodArtABI,
          provider
        );
        const totalSupply_ = await moodArt.totalSupply();
        const price_ = await moodArt.price(totalSupply_);
        setTotalSupply(totalSupply_);
        setPrice(price_);
        console.log(totalSupply_, price_);

        if (connectedAccount) {
          const bal = await moodArt.balanceOf(connectedAccount);
          setNFTBalance(bal);
        }
      } catch (error) {
        setTotalSupply(0);
        setPrice(0);
      } finally {
        setFetching(false);
      }
    };
    fetchPrice();
  }, [selectedNetwork, txHash, connectedAccount]);

  useEffect(() => {
    setTxHash("");
  }, [selectedNetwork]);

  useEffect(() => {
    if (txHash) {
      setTxHash("");
    }
  }, [inputValues]);

  return (
    <>
      <div className="flex flex-col !h-full space-y-6 mx-auto w-full">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            color="primary"
            variant="solid"
            size="md"
            radius="sm"
            className=""
            onPress={onOpen}
          >
            Mint
          </Button>
          <Button
            color=""
            variant="bordered"
            size="md"
            radius="sm"
            className="border-2 border-black dark "
          >
            Trade
          </Button>
        </div>
      </div>
      <Modal
        scrollBehavior="outside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        className="!px-0 bg-default-200 backdrop-blur-sm relative"
      >
        <ModalContent className="flex items-center justify-center w-full !px-0 py-20 ">
          {(onClose) => (
            <>
              <ModalBody className="!p-0 ">
                <div className="grid w-full md:grid-cols-2 gap-12 px-6 md:!px-12">
                  <div className="grid content-start w-full space-y-6">
                    <div>
                      <SelectNetwork />
                    </div>

                    <div className="grid content-between gap-1">
                      <div className="grid items-center grid-cols-2 gap-6 p-3 font-semibold bg-white rounded-md">
                        <div>
                          <p className="text-sm capitalize text-balance !leading-tight">
                            Current Mint Price
                          </p>
                        </div>

                        <h1 className="flex flex-col items-end justify-center text-2xl font-bold leading-none text-right">
                          {fetching ? (
                            <Spinner size="sm" />
                          ) : (
                            <>
                              {ethers.formatEther(price)}{" "}
                              <span className="text-xs opacity-60">
                                ${selectedChain?.nativeCurrency.symbol}
                              </span>
                            </>
                          )}
                        </h1>
                      </div>
                      <div className="grid items-center grid-cols-2 gap-6 p-3 bg-white rounded-md">
                        <p className="text-sm font-semibold leading-tight capitalize text-balance">
                          Your NFT Balance
                        </p>
                        <h1 className="flex flex-col items-end justify-center text-3xl font-bold leading-none text-right">
                          {fetching ? (
                            <Spinner size="sm" />
                          ) : (
                            <> {nftBalance.toString()}</>
                          )}
                        </h1>
                      </div>
                      <div className="grid items-center grid-cols-2 gap-6 p-3 bg-white rounded-md">
                        <p className="text-sm font-semibold leading-tight capitalize text-balance">
                          Your Accumulated Minting Rewards
                        </p>
                        <h1 className="flex flex-col items-end justify-center text-2xl font-bold leading-none text-right">
                          {fetching ? (
                            <Spinner size="sm" />
                          ) : (
                            <>
                              <>{(nftBalance.toString() * 1000).toString()}</>
                              <span className="text-xs opacity-60">$MOOD</span>
                            </>
                          )}
                        </h1>
                      </div>
                    </div>
                    {selectedNetwork == "42793" && (
                      <div>
                        <Tooltip
                          showArrow={true}
                          color="warning"
                          placement="right"
                          content="Add $MOOD to Metamask"
                        >
                          <Button
                            onClick={() => {
                              addToken();
                            }}
                            radius="sm"
                            variant="flat"
                            color="primary"
                            size="sm"
                          >
                            Add $MOOD
                          </Button>
                        </Tooltip>
                      </div>
                    )}

                    {/* <SimulatePrice /> */}
                  </div>

                  <div className="grid content-between gap-6">
                    <div className="flex flex-col items-center justify-center gap-6">
                      <div
                        ref={fieldsRef}
                        className="grid grid-cols-3 gap-2 rounded-xl w-fit"
                      >
                        {renderInputFields()}
                      </div>
                      {/* <div className="w-full px-3">
                        <Slider
                          size="md"
                          step={1}
                          color="primary"
                          label="Expansion Level"
                          showSteps={true}
                          maxValue={4}
                          minValue={1}
                          value={expansionLevel}
                          defaultValue={2}
                          className="max-w-md"
                          onChange={handleSlider}
                        />
                      </div> */}
                    </div>

                    <Button
                      isDisabled
                      fullWidth
                      size="lg"
                      radius="sm"
                      variant="solid"
                      className="mx-auto font-semibold min-w-[120px] h-[50px]"
                      color={txHash ? "success" : "primary"}
                      onClick={handleMint}
                      isLoading={minting}
                      // isDisabled={txHash}
                    >
                      {txHash ? "SUCCESSFULLY MINTED 🎉" : "MINT"}
                    </Button>
                  </div>
                </div>
              </ModalBody>
              <div className="absolute top-3 left-3">
                {fetching && <Spinner size="sm" />}
              </div>

              <div className="absolute bottom-6">
                {txHash && (
                  <Link
                    isExternal
                    href={`${selectedChain?.blockExplorerUrls[0]}/tx/${txHash}`}
                    size="md"
                    showAnchorIcon
                    className="animate-appearance-in"
                  >
                    View Transaction Receipt
                  </Link>
                )}
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
