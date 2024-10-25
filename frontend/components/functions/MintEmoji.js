"use client";

import { Context } from "@/providers/Providers";
import {
  Accordion,
  AccordionItem,
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
import { MetamaskIcon } from "../icons/BasicIcons";
import LivePriceChart from "./LivePriceChart";
import confetti from "canvas-confetti";

export const MintEmoji = ({ showSlider, forceStop }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
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
    setSelectedNavTab,
    setSelectedNetwork,
    showMintModal,
    setShowMintModal,
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
  const [gridCols, setGridCols] = useState(3);

  const shootConfetti = () => {
    const scalar = 2;
    const emoji1 = confetti.shapeFromText({ text: "🥳", scalar });
    const emoji2 = confetti.shapeFromText({ text: "🎉", scalar });
    const emoji3 = confetti.shapeFromText({ text: "🎊", scalar });
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 660,
      ticks: 60,
      zIndex: 100,
      shapes: [emoji1, emoji2, emoji3],
      scalar,
    };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

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

      const getLiveNetworks = () => {
        return networks
          .filter((network) => network.isLive)
          .map((network) => network.rpcUrls[0]);
      };

      const liveNetworkUrls = getLiveNetworks();
      const providers = liveNetworkUrls.map(
        (rpcUrl) => new ethers.JsonRpcProvider(rpcUrl)
      );

      const contracts = networks
        .filter((network) => network.isLive)
        .map(
          (network, index) =>
            new ethers.Contract(
              network.contracts?.moodArt,
              moodArtABI,
              providers[index]
            )
        );

      const emojiHash = await contracts[1].hash(inputValues);

      const isTakenPromises = contracts.map((contract) =>
        contract.tokenized(emojiHash).catch(() => {
          return contract.emojisTaken(emojiHash);
        })
      );

      const isTakenResults = await Promise.all(isTakenPromises);
      console.log(isTakenResults);

      const isTaken = isTakenResults.some((result) => result);

      if (isTaken) {
        alert(`This mood pattern is already tokenized.`);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const nativeBalance = await provider.getBalance(connectedAccount);

      const network = await provider.getNetwork();
      console.log("chainid:", network.chainId);
      console.log("nativeBalance:", nativeBalance);

      if (Number(network.chainId) !== Number(selectedNetwork)) {
        alert("incorrect network.");
        return;
      }

      const moodArt = new ethers.Contract(
        selectedChain?.contracts?.moodArt,
        moodArtABI,
        walletSigner
      );

      const totalSupply_ = await moodArt.tokenIds();
      const price_ = await moodArt.price(totalSupply_);
      setTotalSupply(totalSupply_);
      setPrice(price_);

      // Check if the user has enough native tokens
      if (Number(nativeBalance) < Number(price_)) {
        alert("insufficient balance. please acquire more XTZ.");
        return;
      }

      // Send transaction
      const tx = await moodArt.mint(
        connectedAccount,
        inputValues,
        expansionLevel - 1,
        true,
        0,
        "0x0000000000000000000000000000000000000000",
        {
          value: price_,
        }
      );

      if (tx.hash) {
        setTxHash(tx.hash);
        shootConfetti();
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
    const value = event.target.value;
    setInputValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });

    if (index < inputValues.length - 1 && value.length > 0) {
      // Check against inputValues.length
      if (inputRef.current[index + 1]) {
        // Check if the next input ref exists
        inputRef.current[index + 1].focus();
      }
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
            <div key={i} className="relative select-none">
              <input
                data-emoji-input="unicode"
                key={i}
                type="text"
                data-index={i}
                maxLength={2}
                onKeyDown={(e) => handleKeyDown(e, i)}
                ref={(el) => (inputRef.current[i] = el)}
                className={`w-full aspect-square h-full placeholder:saturate-0 bg-white text-3xl text-center rounded-sm border-1 outline-none focus:border-primary ${
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
    setExpansionLevel(value);

    // Update inputValues and gridCols based on the expansion level
    let newInputValues;
    let newGridCols;
    let fields;
    switch (value) {
      case 1:
        fields = 1;
        newInputValues = Array(1).fill("");
        newGridCols = 1;
        break;
      case 2:
        newInputValues = Array(9).fill("");
        newGridCols = 3;
        fields = 9;
        break;
      case 3:
        newInputValues = Array(25).fill("");
        newGridCols = 5;
        fields = 25;
        break;
      case 4:
        newInputValues = Array(49).fill("");
        newGridCols = 7;
        fields = 49;
        break;
      default:
        newInputValues = Array(49).fill("");
        newGridCols = 3;
        fields = 9;
    }
    setInputValues(newInputValues);
    setGridCols(newGridCols);
    setActiveFields(fields);

    inputRef.current.forEach((input) => {
      if (input) {
        input.value = "";
      }
    });
  };

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        // await connectEthereumWallet();

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
        const totalSupply_ = await moodArt.tokenIds();
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

      handleSlider(expansionLevel);
    }
  }, [inputValues]);

  useEffect(() => {
    if (showMintModal) {
      onOpen();
    } else {
      onClose();
      setShowMintModal(false);
    }
  }, [showMintModal]);

  return (
    <>
      <Button
        color="primary"
        variant="solid"
        size="md"
        radius="sm"
        className="w-fit"
        onPress={onOpen}
      >
        Mint Your Feels
      </Button>

      <Modal
        scrollBehavior="outside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        className="!px-0 bg-default-200 backdrop-blur-sm relative select-none"
      >
        <ModalContent className="flex items-center justify-center w-full !px-0 py-8 md:py-16 ">
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
                            Current NFT Minting Price
                          </p>
                        </div>

                        <h1 className="flex flex-col items-end justify-center text-2xl font-bold leading-none text-right">
                          {fetching ? (
                            <Spinner size="sm" />
                          ) : (
                            <>
                              {ethers.formatEther(price)}{" "}
                              <span className="text-xs opacity-60">
                                ${selectedChain?.nativeCurrency?.symbol}
                              </span>
                            </>
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
                      <div className="grid items-center grid-cols-2 gap-6 p-3 bg-white rounded-md">
                        <p className="text-sm font-semibold leading-tight capitalize text-balance">
                          Your MoodArt NFT Balance
                        </p>
                        <h1 className="flex flex-col items-end justify-center text-3xl font-bold leading-none text-right">
                          {fetching ? (
                            <Spinner size="sm" />
                          ) : (
                            <> {nftBalance.toString()}</>
                          )}
                        </h1>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <>
                        {selectedNetwork == "42793" && (
                          <>
                            <Tooltip
                              size="sm"
                              showArrow={true}
                              color="warning"
                              placement="bottom-start"
                              content="Add $MOOD to Metamask"
                            >
                              <Button
                                onClick={() => {
                                  addToken();
                                }}
                                radius="sm"
                                variant="flat"
                                color="default"
                                size="sm"
                                startContent={<MetamaskIcon />}
                              >
                                Add $MOOD
                              </Button>
                            </Tooltip>
                            <Tooltip
                              size="sm"
                              showArrow={true}
                              className="max-w-[250px]"
                              color="warning"
                              placement="bottom-start"
                              content="Simulate NFT mint price based on current token supply"
                            >
                              <LivePriceChart totalSupply={100} />
                            </Tooltip>
                          </>
                        )}
                      </>
                    </div>
                    <div className="text-xs">
                      <Accordion
                        variant="bordered"
                        className="border-1"
                        isCompact
                      >
                        <AccordionItem
                          key="1"
                          aria-label="Craft"
                          title="Craft Your Masterpiece"
                        >
                          🎨 First things first, choose the blockchain of your
                          choice! Each chain has its own vibe and minting price,
                          so pick wisely. Add at least one to the grid to
                          capture your current mood. Once you&apos;ve got your
                          emojis lined up, get creative with the arrangement!
                          Mix and match, experiment, and let your inner artist
                          shine.
                        </AccordionItem>

                        <AccordionItem
                          key="2"
                          aria-label="Mint"
                          title="Mint Your Feels"
                        >
                          📸 Happy with your masterpiece? Awesome! Smash that
                          MINT button and unleash your feels onto the
                          blockchain! Your unique <i>moodart</i> NFT will be
                          born, forever capturing your emotional snapshot.
                        </AccordionItem>

                        <AccordionItem
                          key="3"
                          aria-label="Claim"
                          title="Claim Your Rewards"
                        >
                          🎁 Soon, you&apos;ll be able to claim 1,000 $MOOD
                          tokens just for minting your <i>moodart</i>. Use them
                          to level up your creation, dive into the Degeneratives
                          ecosystem, explore onchain gaming, and unlock a whole
                          world of awesome tools and features.
                        </AccordionItem>
                      </Accordion>
                    </div>

                    {/* <SimulatePrice /> */}
                  </div>
                  <div className="grid content-between gap-6 ">
                    <div className="flex flex-col items-center justify-center gap-6">
                      <div
                        ref={fieldsRef}
                        style={{
                          gridTemplateColumns: `repeat(${Math.sqrt(
                            inputValues.length
                          )}, 1fr)`,
                        }}
                        className={`grid gap-[1px] content-center items-center justify-center rounded-xl w-fit`}
                      >
                        {renderInputFields()}
                      </div>
                      {showSlider && (
                        <div className="w-full ">
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
                        </div>
                      )}
                    </div>

                    <Button
                      // isDisabled
                      fullWidth
                      size="lg"
                      radius="sm"
                      variant="solid"
                      className="mx-auto font-semibold min-w-[120px]  h-[50px]"
                      color={txHash ? "success" : "primary"}
                      onClick={handleMint}
                      // onClick={shootConfetti}
                      isLoading={minting}
                      isDisabled={txHash || inputValues.length == 1}
                    >
                      <span className="!tracking-wider">
                        {txHash ? "SUCCESSFULLY MINTED 🎉" : "MINT"}
                      </span>
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
