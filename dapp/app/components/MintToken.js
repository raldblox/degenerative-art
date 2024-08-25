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
  useDisclosure,
} from "@nextui-org/react";
import { ethers } from "ethers";

const MintToken = () => {
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
  const [activeFields, setActiveFields] = useState(9);
  const [minting, setMinting] = useState(false);
  const [txHash, setTxHash] = useState("");

  const handleMint = async () => {
    console.log("emojis:", inputValues);

    try {
      setMinting(true);
      console.log("emojis:", inputValues);
      const nftContract = new ethers.Contract(
        "0xa3c4e2C4772B879FD82Dd9a6735B4ee8a600B54F",
        nftAbi,
        signer
      );
      const totalSupply = await nftContract.totalSupply();
      const price = await nftContract.price(totalSupply);

      // Fetch user's native token balance
      const provider = new ethers.BrowserProvider(window.ethereum);
      const nativeBalance = await provider.getBalance(userAddress);

      // Check if the user has enough native tokens
      if (Number(nativeBalance) < Number(price)) {
        alert("insufficient balance. please acquire more XTZ.");
        return;
      }

      // Log transaction details
      console.log("Minting transaction details:");
      console.log("Token ID:", totalSupply.toString());
      console.log("Price:", price.toString());
      console.log("User Address:", userAddress);

      // Send transaction
      const tx = await nftContract.mint(
        inputValues,
        "0xD37D8659153aC1b43704031abBE0266C8F04E8Ed",
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
      alert(
        "oops, something went wrong with the mint. maybe try a different emoji pattern? or just try again later!"
      );
    } finally {
      setMinting(false);
    }
  };

  const handleChange = (event, index) => {
    let value = event.target.value;

    // Ensure only one Unicode character is allowed
    if (value.length > 1) {
      value = value.slice(0, 1); // Keep only the first character
    }

    // Update inputValues array
    setInputValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });

    // Move focus to the next input if this one is filled
    if (index < activeFields - 1 && value.length === 1) {
      inputRef.current[index + 1].focus();
    } else if (
      index === activeFields - 1 &&
      value.length === 1 &&
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
          className={` w-12 h-12 placeholder:saturate-0 text-2xl text-center rounded-lg border-3 border-black outline-none focus:border-indigo-600 ${
            i >= activeFields ? "hidden" : ""
          }`}
          onChange={(e) => {
            const value = e.target.value;
            const unicodeChar = value.match(/./u);
            if (unicodeChar) {
              e.target.value = unicodeChar[0]; // Keep only the first character if multiple are entered
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
      <Button
        fullWidth
        // as={Link}
        // href="#mint"
        size="md"
        radius="full"
        variant="solid"
        color="default"
        className="text-white transition-all duration-300 bg-black w-fit"
        onPress={onOpen}
      >
        Mint Your Feels
      </Button>

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
                <label className="text-xl font-semibold tracking-tight text-center lowercase text-md text-balance">
                  now enter the one-time emoji mood that universe gave you today
                </label>
              </ModalHeader>
              <ModalBody>
                {countdown !== "00:00:00" ? (
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
                    <p className="mt-4 text-xs text-center lowercase md:text-sm">
                      Don&apos;t worry if your cosmic vibes change tomorrow...
                      your dynamic NFT is so well-prepared to evolve alongside
                      you! We&apos;ll provide you 1000 $MOOD token after mint to
                      fuel your daily mood swings for the next 100 days! you may
                      now mint ser 🫡
                    </p>
                  </>
                )}

                {countdown === "00:00:00" && (
                  <>
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div
                        ref={fieldsRef}
                        className="grid grid-cols-3 gap-2 p-4 rounded-lg bg-white/80"
                      >
                        {renderInputFields()}
                      </div>
                    </div>
                    <label className="pb-6 text-sm text-center">
                      (enter 3-9 emojis only)
                    </label>

                    {userAddress ? (
                      <Button
                        size="lg"
                        radius="full"
                        variant="solid"
                        className="mx-auto w-fit"
                        color={txHash ? "success" : "primary"}
                        onClick={handleMint}
                        isLoading={minting}
                        isDisabled={!userAddress || txHash}
                      >
                        {txHash ? "SUCCESS 🎉" : "MINT"}
                      </Button>
                    ) : (
                      <Button
                        size="md"
                        radius="full"
                        variant="solid"
                        className="mx-auto w-fit"
                        color="primary"
                        onClick={connectEthereumWallet}
                      >
                        CONNECT WALLET
                      </Button>
                    )}
                  </>
                )}
              </ModalBody>

              <ModalFooter className="flex justify-center w-full gap-2">
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

export default MintToken;
