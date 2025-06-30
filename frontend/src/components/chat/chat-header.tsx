import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";

interface ChatHeaderProps {
  onReset: () => void;
}

export function ChatHeader({ onReset }: ChatHeaderProps) {
  return (
    <header
      className="border-b sticky top-0 z-10 shadow-md"
      style={{
        background: "linear-gradient(90deg, #ffe082 0%, #ffb300 100%)",
      }}
    >
      <div className="flex items-center justify-between h-20 px-2 max-w-3xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 my-6">
            <Image
              src="/logo.png"
              alt="Nok Air Logo"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full border-2 border-yellow-400 bg-white shadow"
              priority
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-800 drop-shadow-sm tracking-wide">
              Hive Agent
            </h1>
            <span className="text-xs text-gray-700 font-medium mt-1">
              Your friendly HR assistant
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          title="Clear chat"
          className="hover:bg-yellow-100 transition"
        >
          <RefreshCcw className="h-6 w-6 text-black" />
          <span className="sr-only">Clear chat</span>
        </Button>
      </div>
    </header>
  );
}
