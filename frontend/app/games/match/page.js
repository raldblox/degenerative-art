"use client";

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
    <div className="flex flex-col items-center justify-center h-screen bg-[#171717] text-white">
      {shuffledEmojis.length > 0 ? (
        <>
          <h1 className="mb-4 text-xl font-bold md:text-3xl">
            Emoji Matching Game
          </h1>
          <div className="flex items-center justify-center w-full p-6">
            <div className="grid grid-cols-4 gap-2 mb-4 md:gap-4">
              {shuffledEmojis.map((emoji, index) => (
                <div
                  key={index}
                  className={`p-2 md:p-4 h-16 md:h-24 border-2 border-zinc-700 text-3xl flex justify-center items-center cursor-pointer aspect-square ${
                    selectedEmojis.includes(index) ||
                    matchedEmojis.includes(index)
                      ? "bg-[#0a2b1a] border-[#27925d]"
                      : "bg-zinc-800"
                  }`}
                  onClick={() => handleEmojiClick(index)}
                >
                  {selectedEmojis.includes(index) ||
                  matchedEmojis.includes(index) ? (
                    emoji
                  ) : (
                    <Image src="/etherlink.svg" className="h-16" />
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
