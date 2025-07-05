"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Image from "next/image";

export function TypingIndicator() {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev % 3) + 1);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-start p-4 gap-3 animate-in slide-in-from-left duration-500">
      <div className="relative">
        <div className="absolute -inset-1 bg-[#f28b1b]/30 rounded-full animate-ping"></div>
        <Image
          src="/logo.png"
          alt="Hive AI Bot"
          width={20}
          height={20}
          className="relative h-10 w-10 rounded-full border-3 border-[#f28b1b] bg-white shadow-lg"
          priority
        />
      </div>

      <div className="bg-white border-2 border-[#5c4394]/20 rounded-2xl p-4 shadow-lg transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#5c4394]">
            🤖 Thinking
          </span>
          <div className="flex gap-1">
            <span
              className={cn(
                "h-2 w-2 rounded-full bg-[#f28b1b] animate-bounce",
                dots >= 1 ? "opacity-100" : "opacity-30"
              )}
            ></span>
            <span
              className={cn(
                "h-2 w-2 rounded-full bg-[#5c4394] animate-bounce delay-150",
                dots >= 2 ? "opacity-100" : "opacity-30"
              )}
            ></span>
            <span
              className={cn(
                "h-2 w-2 rounded-full bg-[#f28b1b] animate-bounce delay-300",
                dots >= 3 ? "opacity-100" : "opacity-30"
              )}
            ></span>
          </div>
        </div>
      </div>
    </div>
  );
}
