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

const UpdateToken = ({ token }) => {
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

  return (
    <>
      <span
        fullWidth
        // as={Link}
        // href="#mint"
        size="md"
        radius="full"
        variant="solid"
        color="primary"
        className="text-sm lowercase transition-all duration-300 cursor-pointer text-primary hover:scale-95 w-fit"
        onClick={onOpen}
      >
        Update
      </span>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="xl"
        className="p-6"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <label className="text-xl font-semibold tracking-tight text-center text-balance">
                  update your dynamic degeneratives.art
                </label>
              </ModalHeader>
              <ModalBody className="text-center">
                <p className="text-sm lowercase">
                  Pump up those mood swings, ser! Every update costs 10 $MOOD,
                  but it&apos;s worth it! The more you switch it up, the higher
                  your staking rewards will be. The most expressive unlocks the
                  greatest rewards!
                </p>
                <h1 className="py-12 text-2xl">coming very soon</h1>
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
