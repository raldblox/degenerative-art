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
    <div className="flex flex-col !h-full space-y-6 mx-auto w-full">
      {/* <div className="grid w-full max-w-[150px] grid-cols-3 gap-2 ">
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
            className="w-full h-full text-2xl text-center border-2 border-black rounded-lg aspect-square"
          />
        ))}
      </div> */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          color="primary"
          variant="solid"
          size="md"
          radius="sm"
          className=""
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
  );
};
