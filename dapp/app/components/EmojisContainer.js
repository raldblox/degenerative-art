import React from "react";

const EmojisContainer = ({ token }) => {
  return (
    <div className="relative grid grid-cols-3 gap-2 md:gap-4 animate-appearance-in !aspect-square">
      {token?.emojis?.map((emoji, i) => (
        <div
          className="flex items-center justify-center duration-200 cursor-pointer group"
          key={i}
        >
          {/* <span className="absolute aspect-square text-[4.5rem] transition-all group-hover:scale-125 duration-300 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 blur-md opacity-50">
            {emoji}
          </span> */}
          <span className="z-10 text-5xl text-center">{emoji}</span>
        </div>
      ))}
    </div>
  );
};

export default EmojisContainer;
