"use client";

import { Button, Link } from "@nextui-org/react";
import React, { useContext, useState } from "react";
import { Context } from "@/providers/Providers";
import nftAbi from "@/libraries/DegenerativeArtABI.json";
import { ethers } from "ethers";

export default function Mini() {
  const { countdown, userAddress, connectEthereumWallet, signer } = useContext(
    Context
  );
  const [inputValues, setInputValues] = useState(Array(9).fill(""));
  const [minting, setMinting] = useState(false);
  const [txHash, setTxHash] = useState("");

  const handleChange = (event, index) => {
    const value = event.target.value; // Ensure only one character
    setInputValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });
  };

  const handleMint = async () => {
    console.log("emojis:", inputValues);

    try {
      setMinting(true);
      // Check for at least one filled input
      if (inputValues.every((value) => value === "")) {
        alert("Please fill in at least one input.");
        return;
      }

      // Check cooldown (assuming you have 'countdown' and 'timeUpdated' in your Context)
      if (countdown !== "00:00:00") {
        alert(`cooldown not over yet. please wait for ${countdown}.`);
        return;
      }

      // Check if wallet is connected
      if (!userAddress) {
        alert("please connect your wallet first.");
        connectEthereumWallet(); // Assuming you have this function in your Context
        return;
      }

      // Fetch user's native token balance
      const provider = new ethers.BrowserProvider(window.ethereum);
      const nativeBalance = await provider.getBalance(userAddress);

      // Check network (assuming you have the desired network ID in a variable 'targetNetworkId')
      const network = await provider.getNetwork();
      console.log("chainid:", network.chainId);
      const chainId = 42793;

      if (Number(network.chainId) !== chainId) {
        alert("incorrect network. please switch to etherlink network.");
        return;
      }
      console.log("emojis:", inputValues);

      const nftContract = new ethers.Contract(
        "0x5F440745E21D2F0388F7360586e8d92a9058BccC",
        nftAbi,
        signer
      );
      const totalSupply = await nftContract.totalSupply();
      const price = await nftContract.price(totalSupply);

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
        "0x88a87144ED2080c1B077075Bb90dd8EcE5CD8DAD",
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

  return (
    <section className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center space-y-6 ">
        <div className="grid grid-cols-3 gap-2 w-fit">
          {inputValues.map((value, index) => (
            <input
              key={index}
              type="text"
              value={value}
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
                handleChange(e, index);
              }}
              className="w-16 h-16 text-3xl text-center border border-black"
            />
          ))}
        </div>
        <Button
          size="lg"
          className="w-full"
          color="primary"
          radius="none"
          onClick={handleMint}
          isLoading={minting}
        >
          Mint
        </Button>
        {txHash && (
          <Link
            href={`https://explorer.etherlink.com/tx/${txHash}`}
            size="sm"
            showAnchorIcon
            className="animate-appearance-in w-fit"
          >
            View Transaction Receipt
          </Link>
        )}
      </div>
    </section>
  );
}
