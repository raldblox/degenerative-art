"use client";
import * as emoji from "node-emoji";

import { useContext, useEffect, useRef, useState } from "react";
import nftAbi from "@/app/libraries/DegenerativeArtABI.json";
import erc20Abi from "@/app/libraries/ERC20TokenABI.json";
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
    updating,
    setUpdating,
    updated,
    setUpdated,
  } = useContext(Context);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fieldsRef = useRef(null);
  const maxFields = 9;
  const inputRef = useRef([]);
  const [inputValues, setInputValues] = useState(Array(maxFields).fill(""));
  const [activeFields, setActiveFields] = useState(9);

  const [txHash, setTxHash] = useState("");
  const [userNFTs, setUserNFTs] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [emojis, setEmojis] = useState(token?.emojis);

  // Initialize inputValues with the token's emojis on initial render
  useEffect(() => {
    if (token?.emojis) {
      setInputValues(token.emojis); // Take the first 3 emojis
      setActiveFields(9); // Set active fields based on initial emojis
    }
  }, [token]);

  const handleChange = (event, index) => {
    const value = event.target.value;
    console.log(`New value: ${value}`);

    // Update inputValues array
    setInputValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });

    if (index < activeFields - 1 && value.length > 0) {
      inputRef.current[index + 1].focus();
    } else if (
      index === activeFields - 1 &&
      value.length > 0 &&
      activeFields < maxFields
    ) {
      setActiveFields(activeFields + 1);
      inputRef.current[index + 1].focus();
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
      // if (activeFields > 3) {
      //   setActiveFields(activeFields - 1);
      // }
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
          value={inputValues[i]} // Set the initial value from token.emojis
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

  const handleUpdate = async () => {
    if (token.emojis == inputValues) {
      alert("ser, we're not seeing any changes at all.");
      return;
    }

    console.log("updating to:", inputValues);

    try {
      setUpdating(true);
      const nftContract = new ethers.Contract(
        "0xa3c4e2C4772B879FD82Dd9a6735B4ee8a600B54F",
        nftAbi,
        signer
      );
      const MOOD = new ethers.Contract(
        "0xd08B30c1EdA1284cD70E73F29ba27B5315aCc3F9",
        erc20Abi,
        signer
      );

      const updatePrice = ethers.parseEther("10"); // 10 MOOD

      const allowance = await MOOD.allowance(
        userAddress,
        "0xa3c4e2C4772B879FD82Dd9a6735B4ee8a600B54F"
      );
      console.log("allowance:", allowance);

      if (allowance < updatePrice) {
        const tx = await MOOD.approve(
          "0xa3c4e2C4772B879FD82Dd9a6735B4ee8a600B54F",
          updatePrice
        );
        console.log("Approval transaction sent.");
        await tx.wait();
      }

      const updateTx = await nftContract.update(token.tokenId, inputValues);
      await updateTx.wait();
      setTxHash(updateTx.hash);
      setUpdated(true);
      console.log("Emoji updated successfully.");
    } catch (error) {
      console.error("Failed to update emoji:", error);
      alert("hmm, something went wrong. try again?");
    } finally {
      setUpdating(false);
    }
  };

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
        // onClick={onOpen}
      >
        Update (paused)
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
                {countdown !== "00:00:00" && !txHash ? (
                  <>
                    <p className="text-xs text-center lowercase">
                      Ser, see that cooldown timer? Yeah, you can only
                      mint/update your feels every 15 minutes. Gotta pace
                      yourself, champ! Too many mood swings aren&apos;t healthy.
                      Remember to take breaks, hydrate, and maybe touch grass.
                      🧘‍♂️💚
                    </p>
                    <p className="pt-6 mx-auto text-2xl font-semibold">
                      {countdown}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm lowercase">
                      Pump up those mood swings, ser! Every update costs 10
                      $MOOD, but it&apos;s worth it! The more you switch it up,
                      the higher your staking rewards will be. The most
                      expressive unlocks the greatest rewards!
                    </p>
                    <div className="mx-auto">
                      <div className="mx-auto">
                        <div className="grid w-full p-6 duration-300 bg-white group-hover:shadow rounded-2xl aspect-square">
                          <div
                            ref={fieldsRef}
                            className="grid grid-cols-3 gap-3"
                          >
                            {renderInputFields()}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="lg"
                        radius="full"
                        variant="solid"
                        className="mx-auto w-fit"
                        color={txHash ? "success" : "primary"}
                        onClick={handleUpdate}
                        isLoading={updating}
                        // isDisabled={true}
                      >
                        {txHash ? "UPDATED 🎉" : "UPDATE"}
                      </Button>
                    </div>
                  </>
                )}
              </ModalBody>

              <ModalFooter className="flex justify-center w-full gap-2 pt-8">
                {txHash && (
                  <Link
                    href={`https://explorer.etherlink.com/tx/${txHash}`}
                    size="sm"
                    showAnchorIcon
                    className="animate-appearance-in"
                  >
                    View Transaction Receipt
                  </Link>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateToken;
