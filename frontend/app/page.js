"use client";

import {
  Button,
  Input,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [preview, setPreview] = useState(null);

  const [shuffledContent, setShuffledContent] = useState({
    headline: [
      "Mint Your Mood Before It's Gone, Ser 🫡",
      "Yo, Immortalize Your Feels 🤝",
      "Don't Let Your Mood Go to Waste fam 🗑️",
      "Your Emotional State, Tokenized (It's Art, I Swear on Vitalik 🙏)",
      "Feeling Froggy? 🐸 Mint Your Mood into generative art",
      "This is the Way to Express Your Vibes ✨",
      "Turn Your Feels into NFTs, You Absolute Chad 😎",
      "Diamond Hands or Paper Hands? 🤔 Let Your Emojis Decide! 😜",
    ],
    label: [
      "One-Time Mood Check. 3-9 Emojis Only, No BS 🧢",
      "The Universe (and the Blockchain) Need Your Emojis. 3-9, Plz 🙏",
      "Seriously Though, Drop 3-9 Emojis That Sum Up Your Whole Existence rn",
      "One-Time Vibe Check. 3-9 Emojis. No Take Backsies 🙅",
      "Drop Your Emojis, fam. The Blockchain is Listening. 🎧  (3-9 max)",
      "GM/GN? Doesn't Matter. Drop Your Emojis Here 🫡",
      "Wen Mint? Now! Drop 3-9 Emojis and Let's Go 🚀",
      "No Fud, Just Vibes. 3-9 Emojis Only 😎",
      "This Ain't No Shitcoin, This is Art 🎨 (3-9 Emojis pls)",
      "Your Mood, Our Algorithm. Let's Make Some Magic ✨",
    ],
    placeholders: ["🤒", "🤪", "🤕", "😠", "😭", "😂", "😎", "🚀", "🔥"],
  });

  useEffect(() => {
    setShuffledContent({
      headline: shuffleArray([...shuffledContent.headline]),
      label: shuffleArray([...shuffledContent.label]),
      placeholders: shuffleArray([...shuffledContent.placeholders]),
    });
    setMounted(true);
  }, []);

  const fieldsRef = useRef(null);
  const [activeFields, setActiveFields] = useState(3);
  const maxFields = 9;
  const inputRef = useRef([]);
  const [inputValues, setInputValues] = useState(Array(maxFields).fill(""));

  const [htmlContent, setHtmlContent] = useState("");
  const iframeRef = useRef(null);

  useEffect(() => {
    const fetchHtml = async () => {
      try {
        const response = await fetch("./render.html");
        const data = await response.text();
        setHtmlContent(data);
      } catch (error) {
        console.error("Error fetching HTML:", error);
      }
    };
    fetchHtml();
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDocument = iframeRef.current.contentWindow.document;
      iframeDocument.open();
      iframeDocument.write(htmlContent);
      iframeDocument.close();
    }
  }, [htmlContent]);

  useEffect(() => {
    const elements = fieldsRef.current.children;
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = i < activeFields ? "block" : "none";
    }

    if (activeFields > 3 && inputRef.current[activeFields - 1]) {
      inputRef.current[activeFields - 1].focus();
    }
  }, [activeFields]);

  const handleChange = (event, index) => {
    const value = event.target.value.slice(-1); // Get the last entered character
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
          key={i}
          size="lg"
          type="text"
          data-index={i}
          // placeholder={shuffledContent.placeholders[i]}
          ref={(el) => (inputRef.current[i] = el)}
          className={`w-12 h-12 placeholder:saturate-0 text-2xl text-center rounded-lg border-3 border-black outline-none focus:border-indigo-600 ${
            i >= activeFields ? "hidden" : ""
          }`}
          onChange={(e) => handleChange(e, i)}
          onKeyUp={(e) => handleKeyUp(e, i)}
        />
      );
    }
    return inputFields;
  };

  return (
    <main className="relative bg-[#fafafa] w-full min-h-screen overflow-hidden">
      <Navbar position="sticky" maxWidth="full" className="z-50 h-[70px]">
        <NavbarBrand>
          <div>
            <svg
              width="224"
              height="36"
              viewBox="0 0 224 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M30.1959 6.21804L20.7425 0.895891C19.7425 0.318403 18.413 0 16.9994 0C15.5861 0 14.2566 0.31802 13.2585 0.893978L3.92684 6.22187C1.76155 7.47099 0 10.36 0 12.6611V23.3131C0 25.6058 1.77341 28.494 3.95976 29.7554L13.4135 35.0775C14.4139 35.655 15.7433 35.9734 17.157 35.9734C18.5703 35.9734 19.8998 35.6554 20.8975 35.0794L30.2303 29.7516C32.3952 28.5021 34.1568 25.6138 34.1568 23.3131V12.6611C34.1564 10.3684 32.3826 7.47979 30.1959 6.21804ZM32.7029 23.3131C32.7029 25.0892 31.2081 27.5093 29.5066 28.4906L20.1738 33.8188C19.4019 34.2643 18.3021 34.5199 17.157 34.5199C16.0112 34.5199 14.9118 34.2643 14.1333 33.8146L4.67961 28.4925C2.9613 27.5009 1.45348 25.0804 1.45348 23.3131V12.6611C1.45348 10.885 2.94867 8.46409 4.65052 7.48286L13.9822 2.15458C14.7545 1.70912 15.8539 1.45348 16.9994 1.45348C18.1448 1.45348 19.2443 1.70912 20.0223 2.15879L29.476 7.48094C31.1951 8.47289 32.7029 10.8934 32.7029 12.6611V23.3131Z"
                fill="#111111"
              />
              <path
                d="M16.9719 22.9528C16.1609 22.6975 15.3003 22.7741 14.5475 23.1679C12.9949 23.9788 12.3906 25.9026 13.2004 27.4568L14.0056 27.0373C13.4273 25.9271 13.8586 24.5521 14.9681 23.9731C16.0779 23.3929 17.4533 23.8254 18.0339 24.9359L18.8387 24.515C18.4449 23.7618 17.7824 23.2073 16.9719 22.9528Z"
                fill="#111111"
              />
              <path
                d="M8.56216 18.8958C9.56568 18.8958 10.3792 18.0823 10.3792 17.0788C10.3792 16.0752 9.56568 15.2617 8.56216 15.2617C7.55863 15.2617 6.74512 16.0752 6.74512 17.0788C6.74512 18.0823 7.55863 18.8958 8.56216 18.8958Z"
                fill="#111111"
              />
              <path
                d="M21.452 13.8322C19.772 15.5195 18.6288 16.5038 16.3973 15.5229L15.666 17.1857C16.5458 17.573 17.3296 17.7349 18.0372 17.7349C18.5707 17.7349 19.0594 17.6419 19.5125 17.4846C19.6966 18.2921 20.4157 18.8956 21.2798 18.8956C22.284 18.8956 23.0964 18.0828 23.0964 17.0786C23.0964 16.4471 22.7742 15.8918 22.2859 15.5665C22.4409 15.415 22.592 15.2635 22.7398 15.115C24.465 13.3821 25.6042 12.2367 28.3639 14.1869L29.4121 12.7028C25.4003 9.86858 23.2109 12.0664 21.452 13.8322Z"
                fill="#111111"
              />
              <path
                d="M56.4259 17.7543C56.4259 15.6935 55.4092 14.5669 53.3209 14.5669C52.7439 14.5669 52.2493 14.6493 51.8371 14.8142C51.0677 15.1714 50.5457 15.6935 50.2984 16.5178C50.161 16.9025 50.106 17.3147 50.106 17.7543C50.106 18.194 50.161 18.6061 50.2984 18.9908C50.5182 19.7877 51.0952 20.3647 51.8371 20.6669C52.2493 20.8593 52.7439 20.9417 53.3209 20.9417C55.4092 20.9417 56.4259 19.8151 56.4259 17.7543ZM56.4259 12.2588V5.3894H60.5475V17.7543C60.5475 22.1233 57.4425 24.7611 53.2934 24.7611C49.0619 24.7611 45.9844 22.0133 45.9844 17.8093C45.9844 13.9349 48.842 10.7475 52.7439 10.7475C54.2002 10.7475 55.4641 11.1597 56.4259 12.2588ZM67.0047 16.1057C67.4169 16.243 67.884 16.353 68.3786 16.4079C68.8732 16.4903 69.3403 16.5178 69.78 16.5178C70.3295 16.5178 71.7309 16.4079 71.7309 15.6111C71.7309 14.7593 70.5219 14.7318 69.9174 14.7318C68.7083 14.7318 67.6642 15.0066 67.0047 16.1057ZM74.7809 20.3372V24.1841C73.2422 24.5413 71.7034 24.7886 70.1097 24.7886C65.7408 24.7886 62.4984 22.2332 62.4984 17.8093C62.4984 13.4403 65.6309 10.7475 69.78 10.7475C72.6102 10.7475 75.88 12.0939 75.88 15.3088C75.88 18.4962 72.4178 19.6777 69.7525 19.6777C68.7358 19.6777 67.7192 19.403 66.7849 19.0183C67.3345 20.557 68.9831 20.8043 70.412 20.8043C71.1539 20.8043 71.8957 20.7769 72.6376 20.6669C73.3246 20.612 74.1214 20.5296 74.7809 20.3372ZM86.7337 16.3804C86.7337 14.9241 85.3323 14.5669 84.1233 14.5669C82.9143 14.5669 81.5129 14.9241 81.5129 16.3804C81.5129 17.8367 82.9143 18.194 84.1233 18.194C85.3323 18.194 86.7337 17.8367 86.7337 16.3804ZM85.6346 27.2341C85.6346 26.2998 84.9751 25.9426 84.1233 25.9426C83.2715 25.9426 82.612 26.2998 82.612 27.2341C82.612 28.1683 83.2715 28.5255 84.1233 28.5255C84.9751 28.5255 85.6346 28.1683 85.6346 27.2341ZM89.344 27.2341C89.344 30.1467 86.6237 31.3557 84.1233 31.3557C81.5953 31.3557 78.9025 30.0368 78.9025 27.2341C78.9025 25.1733 80.4138 23.7719 82.3372 23.3323V21.8485C81.5404 21.7111 80.8534 21.4638 80.2489 21.1066C78.4629 20.1723 77.3913 18.3863 77.3913 16.3804C77.3913 12.5885 80.771 10.7475 84.1233 10.7475C85.6071 10.7475 86.871 11.0223 87.9152 11.5993C88.9868 11.0773 90.031 10.8849 91.2125 10.8849H92.2841V14.2097H91.6796H91.0751C90.8828 14.2372 90.663 14.2647 90.4431 14.3196C90.7179 14.9516 90.8553 15.6385 90.8553 16.3804C90.8553 19.3205 88.7395 21.244 86.0467 21.821V23.3597C87.8877 23.8818 89.344 25.2282 89.344 27.2341ZM97.1477 16.1057C97.5598 16.243 98.0269 16.353 98.5215 16.4079C99.0161 16.4903 99.4833 16.5178 99.9229 16.5178C100.472 16.5178 101.874 16.4079 101.874 15.6111C101.874 14.7593 100.665 14.7318 100.06 14.7318C98.8513 14.7318 97.8071 15.0066 97.1477 16.1057ZM104.924 20.3372V24.1841C103.385 24.5413 101.846 24.7886 100.253 24.7886C95.8837 24.7886 92.6413 22.2332 92.6413 17.8093C92.6413 13.4403 95.7738 10.7475 99.9229 10.7475C102.753 10.7475 106.023 12.0939 106.023 15.3088C106.023 18.4962 102.561 19.6777 99.8954 19.6777C98.8788 19.6777 97.8621 19.403 96.9278 19.0183C97.4774 20.557 99.1261 20.8043 100.555 20.8043C101.297 20.8043 102.039 20.7769 102.781 20.6669C103.468 20.612 104.264 20.5296 104.924 20.3372ZM122.07 17.7543V24.6237H117.948V17.7543C117.948 15.8584 117.069 14.5669 115.063 14.5669C113.085 14.5669 112.178 15.8858 112.178 17.7543V24.6237H108.056V17.7543C108.056 13.5228 110.969 10.7475 115.063 10.7475C119.322 10.7475 122.07 13.6602 122.07 17.7543ZM128.307 16.1057C128.719 16.243 129.187 16.353 129.681 16.4079C130.176 16.4903 130.643 16.5178 131.082 16.5178C131.632 16.5178 133.033 16.4079 133.033 15.6111C133.033 14.7593 131.824 14.7318 131.22 14.7318C130.011 14.7318 128.967 15.0066 128.307 16.1057ZM136.083 20.3372V24.1841C134.545 24.5413 133.006 24.7886 131.412 24.7886C127.043 24.7886 123.801 22.2332 123.801 17.8093C123.801 13.4403 126.933 10.7475 131.082 10.7475C133.913 10.7475 137.183 12.0939 137.183 15.3088C137.183 18.4962 133.72 19.6777 131.055 19.6777C130.038 19.6777 129.022 19.403 128.087 19.0183C128.637 20.557 130.286 20.8043 131.714 20.8043C132.456 20.8043 133.198 20.7769 133.94 20.6669C134.627 20.612 135.424 20.5296 136.083 20.3372ZM143.338 17.7543V24.6237H139.216V17.7818C139.216 13.2205 142.568 10.7475 146.8 10.7475C146.937 10.7475 147.129 10.7475 147.322 10.775C147.514 10.8025 147.734 10.8574 147.926 10.8849V14.8692C147.789 14.8417 147.624 14.8142 147.432 14.7867C147.239 14.7593 147.074 14.7318 146.937 14.7318C146.25 14.7318 145.701 14.8142 145.233 14.9516C144.464 15.2264 143.777 15.7485 143.53 16.5728C143.392 16.93 143.338 17.3422 143.338 17.7543ZM159.357 17.7543C159.247 15.7485 158.34 14.5669 156.252 14.5669C155.675 14.5669 155.18 14.6493 154.768 14.8142C153.504 15.3912 153.037 16.4629 153.037 17.7818C153.037 18.2214 153.092 18.6336 153.229 18.9908C153.642 20.4196 154.878 20.9417 156.252 20.9417C158.34 20.9417 159.357 19.8151 159.357 17.7543ZM164.578 24.6237H160.456C160.181 23.9368 159.934 23.2498 159.769 22.5354C158.835 24.0742 157.406 24.7611 155.647 24.7611C151.718 24.7611 148.915 21.4638 148.915 17.6994C148.915 13.3579 152.158 10.7475 156.252 10.7475C160.621 10.7475 163.369 13.5502 163.479 17.7543C163.506 18.1115 163.506 18.5237 163.506 19.0183C163.506 20.9417 163.808 22.8651 164.578 24.6237ZM173.645 11.352V15.1714H169.798V17.7543C169.798 19.8701 171.2 20.9417 173.233 20.9417C173.48 20.9417 173.7 20.9142 173.893 20.8868C174.085 20.8593 174.25 20.8318 174.442 20.8043V24.6237C174.195 24.6512 174.003 24.7061 173.865 24.7336C173.7 24.7611 173.425 24.7611 173.068 24.7611C168.919 24.7611 165.677 21.9309 165.677 17.7543V7.5876H169.798V11.352H173.645ZM175.926 10.8849H180.048V24.6237H175.926V10.8849ZM177.987 9.59347C176.585 9.59347 175.596 8.60428 175.596 7.20292C175.596 5.77408 176.585 4.83984 177.987 4.83984C179.416 4.83984 180.35 5.77408 180.35 7.20292C180.35 8.65923 179.443 9.59347 177.987 9.59347ZM196.809 10.8849L191.176 24.6237H187.054L181.421 10.8849H185.516C186.12 12.4511 186.725 13.9899 187.329 15.5561C187.906 17.1223 188.511 18.6611 189.115 20.2273C189.72 18.6611 190.324 17.1223 190.929 15.5561C191.506 13.9899 192.11 12.4511 192.715 10.8849H196.809ZM201.123 16.1057C201.535 16.243 202.002 16.353 202.497 16.4079C202.991 16.4903 203.458 16.5178 203.898 16.5178C204.448 16.5178 205.849 16.4079 205.849 15.6111C205.849 14.7593 204.64 14.7318 204.036 14.7318C202.827 14.7318 201.782 15.0066 201.123 16.1057ZM208.899 20.3372V24.1841C207.36 24.5413 205.822 24.7886 204.228 24.7886C199.859 24.7886 196.617 22.2332 196.617 17.8093C196.617 13.4403 199.749 10.7475 203.898 10.7475C206.728 10.7475 209.998 12.0939 209.998 15.3088C209.998 18.4962 206.536 19.6777 203.871 19.6777C202.854 19.6777 201.837 19.403 200.903 19.0183C201.453 20.557 203.101 20.8043 204.53 20.8043C205.272 20.8043 206.014 20.7769 206.756 20.6669C207.443 20.612 208.24 20.5296 208.899 20.3372ZM211.4 24.1841V20.3372C213.213 20.8868 215.494 20.9967 217.362 20.9967C218.104 20.9967 218.681 20.9692 219.093 20.8868C219.478 20.8318 219.67 20.6944 219.67 20.5021C219.67 20.4196 219.643 20.3647 219.588 20.2823C219.313 20.0075 218.709 19.8701 218.351 19.7877C217.994 19.7052 217.527 19.5953 216.95 19.4854C216.483 19.403 215.933 19.2931 215.301 19.1557C213.158 18.6886 211.509 17.4795 211.509 15.1714C211.509 11.7642 214.834 10.7475 217.637 10.7475C219.396 10.7475 221.154 10.9948 222.885 11.352V15.2264C221.154 14.7043 219.203 14.5669 217.39 14.5669C216.675 14.5669 216.181 14.5944 215.878 14.6768C215.576 14.7593 215.411 14.8966 215.411 15.0615C215.411 15.3088 215.659 15.4737 216.126 15.5561C216.593 15.666 217.252 15.8034 218.049 15.9408C218.764 16.0782 219.45 16.2156 220.11 16.3804C222.143 16.9025 223.6 18.0016 223.6 20.1998C223.6 23.8818 219.89 24.7886 216.923 24.7886C215.054 24.7886 213.213 24.5413 211.4 24.1841Z"
                fill="#111111"
              />
            </svg>
          </div>
        </NavbarBrand>
        <NavbarContent className="hidden gap-4 sm:flex" justify="center">
          <NavbarItem>
            <Button color="foreground" variant="flat" className="font-bold">
              konek welet
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <section className="grid w-full">
        <div
          className={`${
            mounted ? "flex" : "hidden"
          } absolute z-20 flex-col w-full p-4 items-center h-[90vh] justify-center md:p-24 space-y-16"`}
        >
          <div className="max-w-6xl text-4xl font-bold leading-tight tracking-tight text-center lowercase drop-shadow-md text-balance md:text-6xl">
            {shuffledContent.headline[0]}
          </div>
          <div className="max-w-3xl p-4 mt-12 border-2 md:p-8 bg-white/50 border-white/80 rounded-3xl drop-shadow-sm backdrop-blur-md">
            <div className="flex flex-col items-center">
              <label className="text-lg font-bold tracking-tight text-center lowercase text-balance md:text-xl">
                Enter the one-time emoji mood that the universe gave you today.
              </label>
              <p className="mt-4 text-sm text-center lowercase">
                Don&apos;t worry if your cosmic vibes change tomorrow... your
                NFT is so dedicated and prepared to evolve alongside you!
                We&apos;ll provide you free 100 $EMOJI after mint to fuel your
                daily mood swings for the next 60 days! Your ever-changing
                feelings have finally found a match.
              </p>
              <div className="flex flex-col items-center justify-center pt-6 pb-6 space-y-4">
                <div
                  ref={fieldsRef}
                  className="flex flex-wrap items-center justify-center gap-2 p-4 rounded-lg bg-white/50"
                >
                  {renderInputFields()}
                </div>
                <label className="text-sm">(enter 3-9 emojis only)</label>
              </div>
              <Button size="lg" className="dark">
                mint to generate magic 🪄
              </Button>
              <p></p>
            </div>
          </div>
          <div className="mt-8">
            <Link href="#info">see how it work</Link>
          </div>
        </div>
        <div className="w-screen !overflow-hidden">
          <iframe
            ref={iframeRef}
            title="Rendered Document"
            width="100%"
            className="h-screen overflow-hidden"
          />
        </div>
      </section>
      <section className="px-6 py-32" id="info">
        <div className="mx-auto text-center max-w-7xl">
          <h1 className="text-lg lowercase">
            <span className="font-bold">How does it work? </span>{" "}
            {`uhmm... Well, as the intern, my main job is fetching coffee for the devs... but I did overhear them talking about "onchain graphics algorithms" and "interactive assets" ✨ don't ask me for details.. I'm just here for the free mints and good vibes, tbh 😉 But hey, you can check out OnChainVision if you want to learn more from the... uh... "blockchain scientists" behind this onchain stuff. 🧪 They seem to be like dissecting static NFTs, injecting them with alien code, and... honestly, it's kinda creepy. Gotta go now.`}
          </h1>
        </div>
      </section>
    </main>
  );
}
