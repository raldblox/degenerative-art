import React from "react";

const EmojisContainer = ({ emojis }) => {
  return (
    <div className="grid justify-center grid-cols-3 gap-2 md:gap-4 animate-appearance-in">
      {emojis?.emojis?.map((emoji, i) => (
        <div className="p-2 duration-200 cursor-pointer cell group" key={i}>
          <span className="absolute text-[5rem] transition-all group-hover:scale-125 duration-300 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 blur-md opacity-30">
            {emoji}
          </span>
          <span className="text-5xl">{emoji}</span>
        </div>
      ))}
    </div>
  );
};

export default EmojisContainer;
