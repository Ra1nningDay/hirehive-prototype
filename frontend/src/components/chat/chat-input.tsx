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
      className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 sticky bottom-0"
    >
      <div className="flex gap-2 items-end max-w-3xl mx-auto">
        <div className="relative flex-1">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="พิมพ์ข้อความ หรือกดปุ่มไมค์เพื่อพูด..." // --- (Optional) เพิ่มคำแนะนำเล็กน้อย ---
            className="min-h-[60px] resize-none pr-16"
            maxLength={1000}
            disabled={isLoading || isUploading || isRecording} // --- (Optional) ปิดใช้งาน Textarea ตอนบันทึก ---
          />
          <button
            type="button"
            onClick={handleMicClick}
            disabled={isLoading || isUploading}
            // --- 2. ปรับปรุง className ---
            className={`absolute bottom-2 right-2 h-10 w-10 flex items-center justify-center rounded-full transition-colors z-10 shadow-md border ${
              isRecording
                ? "bg-red-500 border-red-600 animate-pulse hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400" // --- สีแดง + Pulse ---
                : "bg-white border-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300" // --- สีปกติ ---
            }`}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            {/* --- 3. เปลี่ยนไอคอนตามสถานะ --- */}
            {isRecording ? (
              <StopCircle className="h-5 w-5 text-white" /> // --- ไอคอน Stop สีขาว ---
            ) : (
              <Mic className="h-5 w-5 text-gray-700" /> // --- ไอคอน Mic สีเทา ---
            )}
          </button>
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isLoading || isUploading || isRecording} // --- ปิดใช้งานตอนบันทึก ---
          className="h-[60px] w-[60px] shrink-0"
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
        <audio ref={audioRef} hidden />
      </div>
      {/* --- (Optional) 4. เพิ่มข้อความบอกสถานะ --- */}
      {isRecording && (
        <p className="text-center text-red-500 text-xs mt-1 animate-pulse">
          กำลังบันทึกเสียง... กดปุ่มสีแดงเพื่อหยุด
        </p>
      )}
      {isUploading && (
        <p className="text-center text-gray-500 text-xs mt-1">
          กำลังประมวลผลเสียง...
        </p>
      )}
    </form>
  );
}
