"use client";
import { useMotionValue } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useMotionTemplate, motion } from "framer-motion";
import { cn } from "@nextui-org/react";

export const FancyCard = ({ text, className }) => {
  let mouseX = useMotionValue(650);
  let mouseY = useMotionValue(50);

  const [randomString, setRandomString] = useState("");

  useEffect(() => {
    const str = generateRandomString(1000);
    setRandomString(str);
    const intervalId = setInterval(() => {
      const str = generateRandomString(1000);
      setRandomString(str);
    }, 1000); // Update every 3000 milliseconds (3 seconds)

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  function onMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);

    const str = generateRandomString(1500);
    setRandomString(str);
  }

  return (
    <div
      className={cn(
        " bg-transparent flex items-center justify-center w-full h-full relative",
        className
      )}
    >
      <div
        onMouseMove={onMouseMove}
        className="relative flex items-center justify-center w-full h-full overflow-hidden bg-transparent group/card"
      >
        <CardPattern
          mouseX={mouseX}
          mouseY={mouseY}
          randomString={randomString}
        />
      </div>
    </div>
  );
};

export function CardPattern({ mouseX, mouseY, randomString }) {
  let maskImage = useMotionTemplate`radial-gradient(500px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none select-none">
      <div className="absolute  inset-0 rounded-lg [mask-image:linear-gradient(white,transparent)] group-hover/card:opacity-100 "></div>
      <motion.div
        className="absolute inset-0 transition duration-700 bg-white rounded-lg opacity-0 group-hover/card:opacity-100 "
        style={style}
      />
      <motion.div
        className="absolute inset-0 text-center duration-500 rounded-lg opacity-80 group-hover/card:opacity-100 "
        style={style}
      >
        <p className="absolute inset-x-0 h-full font-mono text-lg font-bold text-white break-words whitespace-pre-wrap transition duration-500">
          {randomString}
        </p>
      </motion.div>
    </div>
  );
}

const emojiRanges = [
  [0x1f600, 0x1f64f], // Emoticons
  // [0x1f300, 0x1f5ff], // Symbols & Pictographs
  //   [0x1f680, 0x1f6ff], // Transport & Map Symbols
  //   [0x2600, 0x26ff], // Miscellaneous Symbols
  //   [0x2700, 0x27bf], // Dingbats
  //   [0x1f900, 0x1f9ff], // Supplemental Symbols and Pictographs
  //   [0x1fa70, 0x1faff], // Symbols and Pictographs Extended-A
];

export const generateRandomString = (length) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    // Select a random emoji range
    const range = emojiRanges[Math.floor(Math.random() * emojiRanges.length)];

    // Generate a random code point within the selected range
    const codePoint =
      Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];

    // Convert the code point to a string and add it to the result
    result += String.fromCodePoint(codePoint);
  }
  return result;
};

export const Icon = ({ className, ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
