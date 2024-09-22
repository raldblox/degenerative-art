"use client";

import { Button } from "@nextui-org/react";
import React, { useState } from "react";

export const MintEmoji = () => {
  const [inputValues, setInputValues] = useState(Array(9).fill(""));

  const handleChange = (event, index) => {
    const value = event.target.value; // Ensure only one character
    setInputValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = value;
      return newValues;
    });
  };

  return (
    <div className="grid content-between !h-full space-y-8">
      <div className="grid w-full max-w-[200px] grid-cols-3 gap-2 mx-auto">
        {inputValues.map((value, index) => (
          <input
            key={index}
            type="text"
            value={value}
            onChange={(e) => {
              const value = e.target.value;
              const validChar = value.match(/(\p{Emoji_Presentation}|[^\s])/u);
              if (validChar) {
                e.target.value = validChar[0];
              } else {
                e.target.value = "";
              }
              handleChange(e, index);
            }}
            className="w-full h-full text-3xl text-center border-2 border-black rounded-md aspect-square"
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 !w-full">
        <Button
          color="primary"
          variant="solid"
          size="md"
          radius="sm"
          className=" h-[50px]"
        >
          Mint
        </Button>
        <Button
          color=""
          variant="bordered"
          size="md"
          radius="sm"
          className="dark border-2 border-black  h-[50px]"
        >
          Trade
        </Button>
      </div>
    </div>
  );
};
