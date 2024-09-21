import { Skeleton } from "@nextui-org/react";
import React from "react";

export default function MoodSweeper() {
  return (
    <div className="w-full min-h-screen p-6 bg-zinc-700 text-zinc-200">
      <div className="grid h-full gap-6 md:grid-cols-3">
        <div className="h-full bg-zinc-800">hi</div>
        <div className="h-full p-6 md:col-span-2 bg-zinc-800">
          <ul className="grid w-full grid-cols-5 gap-2 md:grid-cols-5 lg:grid-cols-10 cursor-[url(),_pointer]">
            {Array.from({ length: 100 }, (_, i) => (
              <li
                key={i}
                className="flex items-center text-2xl aspect-square  min-h-[50px] bg-zinc-600 hover:bg-zinc-700 justify-center w-full animate-appearance-in"
              >
                {i + 1}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
