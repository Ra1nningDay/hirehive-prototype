import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";

interface ChatHeaderProps {
  onReset: () => void;
}

export function ChatHeader({ onReset }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-10">
      {/* Main Header Content */}
      <div
        className="relative"
        style={{
          background: "#5c4394",
        }}
      >
        <div className="flex items-center justify-between h-20 px-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Hive AI Logo"
                width={56}
                height={56}
                className="relative h-14 w-14 rounded-full border-3 border-white bg-white shadow-lg"
                priority
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-black text-white drop-shadow-lg tracking-wide">
                🎯 HIVE AI
              </h1>
              <span className="text-sm text-white/95 font-bold">
                Interview Game Challenge!
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
              <span className="text-white font-semibold text-sm">Level 1</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onReset}
              title="Restart Game"
              className="hover:bg-white/20 transition-all duration-300 rounded-full h-12 w-12"
            >
              <RefreshCcw className="h-6 w-6 text-white" />
              <span className="sr-only">Restart Game</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
