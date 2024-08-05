"use client";

import {
  Button,
  Image,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuToggle,
  Spinner,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

const emojis = [
  // Positive emotions
  "😄",
  "😃",
  "😀",
  "😊",
  "😇",
  "🥰",
  "😍",
  "🤩",
  "🥳",
  "🎉",
  "🎊",
  "🎈",
  "❤️",
  "💖",
  "💗",
  "💓",
  "💞",
  "💕",
  "💝",
  "💟",
  "❣",
  "💛",
  "💚",
  "💙",
  "💜",
  "🤎",
  "🖤",
  "🤍",
  "💯",
  "🔥",
  "✨",
  "💫",
  "🤩",
  "🥳",
  "🙌",
  "👍",
  "👌",
  "👏",
  "💪",
  "🙏",
  "🤝",
  "😊",
  "😌",
  "😎",
  "☺️",
  "😋",
  "😛",
  "😜",
  "😝",
  "🤗",
  "😙",
  "😚",
  "😻",
  "😽",
  "🥰",
  "😍",
  "🤩",
  "🥳",
  "😎",
  "🤓",

  // Neutral emotions
  "😐",
  "😑",
  "😶",
  "🙄",
  "😏",
  "😌",
  "😐",
  "😑",
  "😶",
  "🙄",
  "😏",

  // Negative emotions
  "😔",
  "🙁",
  "☹️",
  "😣",
  "😖",
  "😫",
  "😩",
  "😭",
  "😢",
  "😰",
  "😥",
  "😓",
  "😞",
  "😟",
  "😤",
  "😠",
  "😡",
  "🤬",
  "🤯",
  "😨",
  "😱",
  "😰",
  "😥",
  "😓",
  "🤢",
  "🤮",
  "🤧",
  "😷",
  "🤒",
  "🤕",
  "🥴",
  "😵",
  "💀",
  "☠️",
  "😭",
  "😢",
  "😰",
  "😥",
  "😓",
  "😞",

  // Other expressions and symbols
  "🤔",
  "🤨",
  "🧐",
  "🤓",
  "😎",
  "🥸",
  "🤠",
  "🥳",
  "😜",
  "🤪",
  "😝",
  "😛",
  "🤑",
  "😲",
  "😳",
  "🥺",
  "😖",
  "😞",
  "😟",
  "😤",
  "😠",
  "😡",
  "🤬",
  "😶",
  "😐",
  "😑",
  "😬",
  "🙄",
  "😪",
  "😴",
  "😌",
  "🤤",
  "🙃",
  "🤑",
  "😲",
  "🤐",
  "🥴",
  "🤢",
  "🤮",
  "🤧",
  "😷",
  "🤒",
  "🤕",
  "🥴",
  "😵",
  "💀",
  "🤖",
  "👽",
  "👾",
  "👻",
  "👽",
  "👾",
  "👻",
  "💩",
  "🔥",
  "💫",
  "✨",
  "💯",
  "💢",
  "💥",
  "❤️",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🖤",
  "🤍",
  "🤎",
  "💔",
  "❣️",
  "💕",
  "💞",
  "💓",
  "💗",
  "💖",
  "💘",
  "💝",
  "💟",
  "☮️",
  "✝️",
  "☪️",
  "🕉",
  "☸️",
  "✡️",
  "🔯",
  "🕎",
  "☯️",
  "☦️",
  "🛐",
  "⛎",
  "♈️",
  "♉️",
  "♊️",
  "♋️",
  "♌️",
  "♍️",
  "♎️",
  "♏️",
  "♐️",
  "♑️",
  "♒️",
  "♓️",
  "♠️",
  "♣️",
  "♥️",
  "♦️",
  "🃏",
  "🀄",
  "🎴",
  "🎲",
  "🎯",
  "🎳",
  "🎮",
  "🎰",
  "🧩",
  "♟",
  "🎭",
  "🎨",
  "🎬",
  "🎤",
  "🎧",
  "🎼",
  "🎹",
  "🥁",
  "🎷",
  "🎺",
  "🎸",
  "🎻",
  "🎬",
  "🏹",
  "🎣",
  "🏊‍♀️",
  "🏄‍♂️",
  "🚵‍♀️",
  "🧗‍♂️",
  "🤺",
  "🤼‍♀️",
  "🤸‍♂️",
  "⛹️‍♀️",
  "⚽",
  "🏀",
  "🏈",
  "⚾",
  "🥎",
  "🎾",
  "🏐",
  "🏉",
  "🥏",
  "🎱",
  "🪀",
  "🏓",
  "🏸",
  "🏒",
  "🏑",
  "🏏",
  "⛳",
  "🏹",
  "🎣",
  "🤿",
];

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

export const formatTime = (time) => {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = time % 1000;
  return (
    <span>
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
      <span className="text-xs">
        .{milliseconds.toString().padStart(3, "0")}
      </span>
    </span>
  );
};

export default function MoodMatch() {
  const [shuffledEmojis, setShuffledEmojis] = useState([]);
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [matchedEmojis, setMatchedEmojis] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [d9e89869234ce2877, f8b24bf7458bcf00] = useState(null);

  useEffect(() => {
    const selectedEmojis = shuffleArray(emojis).slice(0, 20);
    const duplicatedEmojis = shuffleArray([
      ...selectedEmojis,
      ...selectedEmojis,
    ]);
    setShuffledEmojis(duplicatedEmojis);
  }, []);

  useEffect(() => {
    if (selectedEmojis.length === 2) {
      const [firstIndex, secondIndex] = selectedEmojis;
      if (shuffledEmojis[firstIndex] === shuffledEmojis[secondIndex]) {
        setMatchedEmojis([...matchedEmojis, firstIndex, secondIndex]);
      }
      setTimeout(() => {
        setSelectedEmojis([]);
      }, 500);
    }
  }, [selectedEmojis]);

  useEffect(() => {
    if (matchedEmojis.length === 16) {
      const totalTime = Date.now() - startTime;
      f8b24bf7458bcf00(totalTime);
      setElapsedTime(0);
    }
  }, [matchedEmojis, startTime]);

  useEffect(() => {
    if (startTime) {
      const timerId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10);
      return () => clearInterval(timerId);
    }
  }, [startTime]);

  const handleEmojiClick = (index) => {
    if (!startTime) {
      setStartTime(Date.now());
    }
    if (
      selectedEmojis.length < 2 &&
      !selectedEmojis.includes(index) &&
      !matchedEmojis.includes(index)
    ) {
      setSelectedEmojis([...selectedEmojis, index]);
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground dark">
      <Navbar disableAnimation isBordered maxWidth="full" position="sticky">
        {/* <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle />
        </NavbarContent> */}

        <NavbarContent className="pr-3 sm:hidden" justify="center">
          <NavbarBrand>
            <p className="text-2xl font-bold text-inherit">M👀DMATCH</p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden gap-4 sm:flex" justify="center">
          <NavbarBrand>
            <p className="text-2xl font-bold text-inherit">M👀DMATCH</p>
          </NavbarBrand>
          {/* <NavbarItem>
            <Link color="foreground" href="#">
              Features
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link href="#" aria-current="page" color="warning">
              Customers
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Integrations
            </Link>
          </NavbarItem> */}
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem className="w-32">
            {d9e89869234ce2877 === null && shuffledEmojis.length > 0 && (
              <h5 className="animate-appearance-in">
                <span className="text-4xl animate-appearance-in">
                  {formatTime(elapsedTime)}
                </span>
              </h5>
            )}
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu>
          <NavbarItem className="hidden lg:flex">
            <Link href="#">Login</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color="warning" href="#" variant="flat">
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarMenu>
      </Navbar>
      <section className="flex items-center justify-center flex-grow w-full p-6 md:p-12">
        <div
          className={`relative h-full text-center transition-transform duration-200 rounded-2xl ${
            d9e89869234ce2877
              ? "border-[#38ff9c] my-3 md:my-6"
              : "border-transparent"
          }`}
        >
          {shuffledEmojis.length > 0 ? (
            <>
              <div className="grid content-center w-full h-full grid-cols-4 gap-1 md:grid-cols-10">
                {shuffledEmojis.map((emoji, index) => (
                  <div
                    key={index}
                    className={`max-h-[73px] md:max-h-[90px] md:min-h-[90px] h-[21vw] md:h-[20vw] border-2 rounded-lg border-transparent text-3xl md:text-4xl flex justify-center items-center cursor-pointer aspect-square 
                    ${
                      d9e89869234ce2877
                        ? "border-transparent bg-[#3131ff]/90 duration-200 transition-all hover:bg-green-950 hover:border-[#3131ff] animate-appearance-in"
                        : ` ${
                            selectedEmojis.includes(index)
                              ? "!bg-transparent !border-cyan-500"
                              : ""
                          }
                    ${
                      matchedEmojis.includes(index)
                        ? "!bg-[#3131ff]"
                        : "bg-blue-950"
                    }`
                    }
                    transition duration-200 animate-appearance-in`}
                    onClick={() => handleEmojiClick(index)}
                  >
                    {selectedEmojis.includes(index) ||
                    matchedEmojis.includes(index) ? (
                      emoji
                    ) : (
                      <Image
                        src="/icon.svg"
                        className={`h-12 md:h-16 !bg-transparent opacity-50 animate-appearance-in ${
                          elapsedTime ? "animate-appearance-in" : ""
                        }`}
                        alt="Etherlink"
                      />
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <Spinner size="sm" className="p-6" />
          )}
        </div>
      </section>
    </div>
  );
}
