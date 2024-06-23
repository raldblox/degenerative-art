"use client";

import { EmojiGlass } from "@/app/(components)/EmojiGlass";
import { Image, Spinner } from "@nextui-org/react";
import { useState, useEffect } from "react";

const emojis = [
  "🤢",
  "🤮",
  "🌲",
  "🍏",
  "🥬",
  "🥗",
  "📗",
  "💚",
  "🟢",
  "🟩",
  "😛",
  "😜",
  "😋",
  "🤗",
  "🤔",
  "🤐",
  "😶",
  "🤑",
  "😏",
  "🙄",
  "😳",
  "😬",
  "😴",
  "🤕",
  "🤠",
  "🤧",
  "😢",
  "😵",
  "😎",
  "🤓",
  "😡",
  "😭",
  "😫",
  "😠",
];

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const EmojiMatchingGame = () => {
  const [shuffledEmojis, setShuffledEmojis] = useState([]);
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [matchedEmojis, setMatchedEmojis] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const selectedEmojis = shuffleArray(emojis).slice(0, 8);
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
      setScore(totalTime);
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

  const formatTime = (time) => {
    const seconds = Math.floor(time / 1000);
    const milliseconds = time % 1000;
    return `${seconds}.${milliseconds.toString().padStart(3, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      {shuffledEmojis.length > 0 ? (
        <>
          <h1 className="mb-4 text-xl font-bold md:text-3xl">
            Emoji Matching Game
          </h1>
          <div className="flex items-center justify-center w-full p-6">
            <div className="grid grid-cols-4 gap-4 mb-4">
              {shuffledEmojis.map((emoji, index) => (
                <div
                  key={index}
                  className={`h-16 md:h-20 rounded-full text-5xl flex justify-center items-center cursor-pointer aspect-square ${
                    selectedEmojis.includes(index) ||
                    matchedEmojis.includes(index)
                      ? "bg-white border-transparent shadow-sm "
                      : "bg-zinc-100 shadow-inner "
                  }`}
                  onClick={() => handleEmojiClick(index)}
                >
                  {selectedEmojis.includes(index) ||
                  matchedEmojis.includes(index) ? (
                    <EmojiGlass emoji={emoji} />
                  ) : (
                    <svg
                      className="w-12 h-12 text-zinc-700"
                      viewBox="0 0 35 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g fill="currentColor">
                        <path d="M30.1959 6.21804L20.7425 0.895891C19.7425 0.318403 18.413 0 16.9994 0C15.5861 0 14.2566 0.31802 13.2585 0.893978L3.92684 6.22187C1.76155 7.47099 0 10.36 0 12.6611V23.3131C0 25.6058 1.77341 28.494 3.95976 29.7554L13.4135 35.0775C14.4139 35.655 15.7433 35.9734 17.157 35.9734C18.5703 35.9734 19.8998 35.6554 20.8975 35.0794L30.2303 29.7516C32.3952 28.5021 34.1568 25.6138 34.1568 23.3131V12.6611C34.1564 10.3684 32.3826 7.47979 30.1959 6.21804ZM32.7029 23.3131C32.7029 25.0892 31.2081 27.5093 29.5066 28.4906L20.1738 33.8188C19.4019 34.2643 18.3021 34.5199 17.157 34.5199C16.0112 34.5199 14.9118 34.2643 14.1333 33.8146L4.67961 28.4925C2.9613 27.5009 1.45348 25.0804 1.45348 23.3131V12.6611C1.45348 10.885 2.94867 8.46409 4.65052 7.48286L13.9822 2.15458C14.7545 1.70912 15.8539 1.45348 16.9994 1.45348C18.1448 1.45348 19.2443 1.70912 20.0223 2.15879L29.476 7.48094C31.1951 8.47289 32.7029 10.8934 32.7029 12.6611V23.3131Z" />
                        <path d="M16.9719 22.9528C16.1609 22.6975 15.3003 22.7741 14.5475 23.1679C12.9949 23.9788 12.3906 25.9026 13.2004 27.4568L14.0056 27.0373C13.4273 25.9271 13.8586 24.5521 14.9681 23.9731C16.0779 23.3929 17.4533 23.8254 18.0339 24.9359L18.8387 24.515C18.4449 23.7618 17.7824 23.2073 16.9719 22.9528Z" />
                        <path d="M8.56216 18.8958C9.56568 18.8958 10.3792 18.0823 10.3792 17.0788C10.3792 16.0752 9.56568 15.2617 8.56216 15.2617C7.55863 15.2617 6.74512 16.0752 6.74512 17.0788C6.74512 18.0823 7.55863 18.8958 8.56216 18.8958Z" />
                        <path d="M21.452 13.8322C19.772 15.5195 18.6288 16.5038 16.3973 15.5229L15.666 17.1857C16.5458 17.573 17.3296 17.7349 18.0372 17.7349C18.5707 17.7349 19.0594 17.6419 19.5125 17.4846C19.6966 18.2921 20.4157 18.8956 21.2798 18.8956C22.284 18.8956 23.0964 18.0828 23.0964 17.0786C23.0964 16.4471 22.7742 15.8918 22.2859 15.5665C22.4409 15.415 22.592 15.2635 22.7398 15.115C24.465 13.3821 25.6042 12.2367 28.3639 14.1869L29.4121 12.7028C25.4003 9.86858 23.2109 12.0664 21.452 13.8322Z" />
                      </g>
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="text-lg">
            {score !== null ? (
              <span>Final Score: {formatTime(score)} seconds</span>
            ) : (
              <span>Time: {formatTime(elapsedTime)} seconds</span>
            )}
          </div>
        </>
      ) : (
        <Spinner color="success" />
      )}
    </div>
  );
};

export default EmojiMatchingGame;
