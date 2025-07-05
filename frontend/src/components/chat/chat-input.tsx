"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
// --- 1. Import StopCircle ---
import { Send, Mic, StopCircle } from "lucide-react";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const { isRecording, isUploading, audioRef, startRecording, stopRecording } =
    useAudioRecorder((text) => {
      const cleaned = text ? text.trim() : "";
      if (cleaned.length >= 3) {
        onSend(cleaned);
      }
    });

  const handleMicClick = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }
    startRecording();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isUploading) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t-4 border-[#f28b1b] bg-white/90 backdrop-blur-lg p-6 sticky bottom-0 shadow-2xl"
    >
      <div className="flex gap-3 items-end max-w-4xl mx-auto">
        <div className="relative flex-1">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="🎮 Type your message or press mic to start the game! 🎯"
            className="min-h-[60px] resize-none pr-16 rounded-2xl border-2 border-[#5c4394]/30 focus:border-[#f28b1b] transition-all duration-300 text-base font-medium shadow-lg"
            maxLength={1000}
            disabled={isLoading || isUploading || isRecording}
          />
          <button
            type="button"
            onClick={handleMicClick}
            disabled={isLoading || isUploading}
            className={`absolute bottom-2 right-2 h-12 w-12 flex items-center justify-center rounded-full transition-all duration-300 z-10 shadow-lg border-2 transform hover:scale-110 ${
              isRecording
                ? "bg-red-500 border-red-600 animate-pulse hover:bg-red-600 shadow-red-300"
                : "bg-gradient-to-r from-[#f28b1b] to-[#ff9d3a] border-[#f28b1b] hover:from-[#ff9d3a] hover:to-[#f28b1b] shadow-orange-300"
            }`}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            {isRecording ? (
              <StopCircle className="h-6 w-6 text-white animate-pulse" />
            ) : (
              <Mic className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isLoading || isUploading || isRecording}
          className="h-[60px] w-[60px] shrink-0 bg-gradient-to-r from-[#5c4394] to-[#7b5bb0] hover:from-[#7b5bb0] hover:to-[#5c4394] text-white rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-110 border-2 border-[#5c4394]"
        >
          <Send className="h-6 w-6" />
          <span className="sr-only">Send message</span>
        </Button>
        <audio ref={audioRef} hidden />
      </div>
      {/* Game-style Status Messages */}
      {isRecording && (
        <div className="text-center mt-3">
          <p className="text-red-500 text-sm font-bold animate-pulse bg-red-50 px-4 py-2 rounded-full inline-block border-2 border-red-200">
            🎤 Recording... Press red button to stop
          </p>
        </div>
      )}
      {isUploading && (
        <div className="text-center mt-3">
          <p className="text-[#5c4394] text-sm font-bold bg-purple-50 px-4 py-2 rounded-full inline-block border-2 border-purple-200">
            ⚡ Processing audio...
          </p>
        </div>
      )}
    </form>
  );
}
