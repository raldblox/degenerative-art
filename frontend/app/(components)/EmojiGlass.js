import React from "react";

export const EmojiGlass = ({ emoji }) => {
  return (
    <div className="p-3 cursor-pointer aspect-video bg-default-50 cell group ">
      <span className="absolute group-hover:blur-sm text-center z-0 text-[5rem] transition-all group-hover:scale-125 duration-300 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 blur-md opacity-40">
        {emoji}
      </span>
      <span className="z-10 text-4xl duration-200 group-hover:scale-110 group-hover:drop-shadow-md">
        {emoji}
      </span>
    </div>
  );
};
