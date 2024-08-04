"use client";

import { useContext, useEffect, useRef, useState } from "react";
import nftAbi from "@/app/libraries/DegenerativeArtABI.json";
import { Context } from "../providers/Providers";
import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { ethers } from "ethers";
import EmojisContainer from "./EmojisContainer";

const UpdateToken = () => {
  const {
    userAddress,
    signer,
    countdown,
    timeUpdated,
    connectEthereumWallet,
  } = useContext(Context);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fieldsRef = useRef(null);
  const maxFields = 9;
  const inputRef = useRef([]);
  const [inputValues, setInputValues] = useState(Array(maxFields).fill(""));
  const [activeFields, setActiveFields] = useState(3);
  const [minting, setMinting] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [userNFTs, setUserNFTs] = useState([]);
  const [fetching, setFetching] = useState(false);

  const handleMint = async () => {
    console.log("emojis:", inputValues);

    try {
      setMinting(true);
      console.log("emojis:", inputValues);
      const nftContract = new ethers.Contract(
        "0xcf552524772605de32dae649f7ced60a286b0d21",
        nftAbi,
        signer
      );
      const totalSupply = await nftContract.totalSupply();
      const price = await nftContract.price(totalSupply);

      // Log transaction details
      console.log("Minting transaction details:");
      console.log("Token ID:", totalSupply.toString());
      console.log("Price:", price.toString());
      console.log("User Address:", userAddress);

      // Send transaction
      const tx = await nftContract.mint(
        inputValues,
        "0x8dc9c31AC117b29396399C2C8031b99B1af59457",
        {
          value: price,
        }
      );
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      setTxHash(tx.hash);

      // Find the TokenMinted event in the transaction receipt
      const event = receipt?.events?.find((e) => e.event === "TokenMinted");
      if (event) {
        const actualTokenId = event.args.tokenId;
        console.log("Actual Token ID:", actualTokenId.toString());
        // You can now use the actualTokenId for further actions if needed
      } else {
        console.error("TokenMinted event not found in transaction receipt.");
      }

      console.log("Minting successful!");
    } catch (error) {
      // Log error details
      console.error("Minting failed:", error);

      // Handle specific errors
      if (error.code === -32603) {
        console.error(
          "Internal JSON-RPC error. Check the parameters and try again."
        );
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        console.error(
          "Insufficient funds for gas or value. Please ensure your wallet has enough balance."
        );
      } else if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
        console.error(
          "The gas limit could not be estimated. Try setting a higher gas limit manually."
        );
      } else {
        console.error("An unknown error occurred:", error.message);
      }
    } finally {
      setMinting(false);
    }
  };

  const handleChange = (event, index) => {
    const value = event.target.value; // Get the last entered character
    // Log the actual value and its Unicode code point
    console.log(`New value: ${value}`);
    setInputValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });

    if (index < activeFields - 1 && value.length > 0) {
      // Focus on next input if current input is filled and there are more inputs
      inputRef.current[index + 1].focus();
    } else if (
      index === activeFields - 1 &&
      value.length > 0 &&
      activeFields < maxFields
    ) {
      // Add new input if current input is filled and there are less than 9 inputs
      setActiveFields(activeFields + 1);
      inputRef.current[index + 1].focus(); // Focus on new input
    }
  };

  const handleKeyUp = (event, index) => {
    if (
      (event.key === "Delete" || event.key === "Backspace") &&
      inputValues[index] === ""
    ) {
      if (index > 0) {
        inputRef.current[index - 1].focus();
      }
      if (activeFields > 3) {
        setActiveFields(activeFields - 1);
      }
    }
  };

  const renderInputFields = () => {
    const inputFields = [];
    for (let i = 0; i < maxFields; i++) {
      inputFields.push(
        <input
          data-emoji-input="unicode"
          key={i}
          size="lg"
          type="text"
          data-index={i}
          ref={(el) => (inputRef.current[i] = el)}
          className={`animate-appearance-in w-12 h-12 placeholder:saturate-0 text-2xl text-center rounded-lg border-3 border-black outline-none focus:border-indigo-600 ${
            i >= activeFields ? "hidden" : ""
          }`}
          onChange={(e) => {
            const value = e.target.value;
            const emoji = value.match(/[\p{Emoji}]/u);
            if (emoji) {
              e.target.value = emoji[0];
            } else {
              e.target.value = "";
            }
            handleChange(e, i);
          }}
          onKeyUp={(e) => handleKeyUp(e, i)}
        />
      );
    }
    return inputFields;
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

  const fetchTokens = async () => {
    if (userAddress) {
      await connectEthereumWallet();
    }
    try {
      setFetching(true);
      const node = "https://node.mainnet.etherlink.com";
      const provider = new ethers.JsonRpcProvider(node);
      const nftContract = new ethers.Contract(
        "0xcf552524772605de32dae649f7ced60a286b0d21",
        nftAbi,
        provider
      );
      const totalSupply = await nftContract.totalSupply();
      console.log("totalSupply///", totalSupply);
      const balanceOf = await nftContract.balanceOf(userAddress);
      console.log("balanceOf///", balanceOf);

      const userTokens = [];

      // Fetch token data sequentially
      for (let tokenId = 0; tokenId < Number(totalSupply); tokenId++) {
        const owner = await nftContract.ownerOf(tokenId);
        if (owner.toLowerCase() === userAddress?.toLowerCase()) {
          console.log("found///", tokenId);
          const emojis = await nftContract.getEmojis(tokenId);
          const moodSwing = await nftContract.getMoodSwing(tokenId);
          userTokens.push({
            tokenId,
            owner,
            emojis,
            moodSwing: moodSwing.toString(),
          });
          setUserNFTs(userTokens);

          if (userTokens.length === Number(balanceOf)) {
            break;
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const handleRegenerate = () => {
    fetchTokens(); // Call fetchTokens to refresh the data
  };

  return (
    <>
      <Button
        fullWidth
        // as={Link}
        // href="#mint"
        size="md"
        radius="full"
        variant="solid"
        color="primary"
        className="transition-all duration-300 w-fit"
        onPress={onOpen}
      >
        Your Feels
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="full"
        className="p-6 overflow-y-scroll"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <label className="text-2xl font-semibold tracking-tight text-center lowercase text-balance">
                  all your minted feels onchain
                </label>
              </ModalHeader>
              <ModalBody>
                <>
                  <div className="grid gap-3 md:grid-cols-5">
                    {userNFTs?.map((token) => (
                      <Link
                        href={`/id/${token.tokenId}`}
                        key={token.tokenId}
                        className="flex flex-col items-center justify-center duration-200 border-2 border-white shadow-md bg-default-100 hover:shadow rounded-3xl"
                      >
                        <div className="grid w-full p-6 duration-300 bg-white group-hover:shadow rounded-2xl aspect-square animate-appearance-in">
                          <div className="relative grid grid-cols-3 gap-2 md:gap-4 ">
                            {token?.emojis?.map((emoji, i) => (
                              <div
                                className="flex items-center justify-center duration-200 cursor-pointer group"
                                key={i}
                              >
                                <span className="z-10 text-3xl text-center">
                                  {emoji}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-start justify-between w-full px-3 py-3 text-xs text-black">
                          <div className="flex items-center justify-between w-full font-semibold">
                            <p>degeneratives.art #{token.tokenId}</p>
                            <p className="flex items-center gap-1 text-zinc-600">
                              {token?.moodSwing}
                              <span>
                                <svg
                                  className="w-4 h-4"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M5 3h14v2H5zm0 16H3V5h2zm14 0v2H5v-2zm0 0h2V5h-2zM10 8H8v2h2zm4 0h2v2h-2zm1 5H9v2h6z"
                                  />
                                </svg>
                              </span>
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {fetching && (
                      <div className="flex flex-col items-center justify-center duration-200 border-2 border-white shadow-md bg-default-100 hover:shadow rounded-3xl">
                        <div className="grid w-full p-6 duration-300 bg-white group-hover:shadow rounded-2xl aspect-square">
                          <div className="relative grid grid-cols-3 gap-2 md:gap-4 animate-appearance-in">
                            {[...Array(9)].map((_, index) => (
                              <Skeleton
                                key={index}
                                className="h-8 rounded-full"
                              >
                                <div className="w-8 h-8 rounded-full bg-default-200"></div>
                              </Skeleton>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-start justify-between w-full px-3 py-3 text-xs text-black">
                          <div className="flex items-center justify-between w-full font-semibold">
                            <p>degeneratives.art</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              </ModalBody>

              <ModalFooter className="flex justify-center w-full gap-2 pt-8">
                <Button
                  onClick={onClose}
                  radius="full"
                  variant="light"
                  color="danger"
                >
                  CLOSE
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateToken;
