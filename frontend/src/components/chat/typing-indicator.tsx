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
    <div className="flex items-center justify-start p-4 gap-3">
      <Image
        src="/logo.png"
        alt="Nok Air Logo"
        width={20}
        height={20}
        className="h-8 w-8 rounded-full border-2 border-yellow-400 bg-white shadow"
        priority
      />

      <div className="bg-muted rounded-lg p-3 inline-flex gap-1">
        <span
          className={cn(
            "h-2 w-2 rounded-full bg-foreground/60 animate-pulse",
            dots >= 1 ? "opacity-100" : "opacity-30"
          )}
        ></span>
        <span
          className={cn(
            "h-2 w-2 rounded-full bg-foreground/60 animate-pulse delay-150",
            dots >= 2 ? "opacity-100" : "opacity-30"
          )}
        ></span>
        <span
          className={cn(
            "h-2 w-2 rounded-full bg-foreground/60 animate-pulse delay-300",
            dots >= 3 ? "opacity-100" : "opacity-30"
          )}
        ></span>
      </div>
    </div>
  );
}
