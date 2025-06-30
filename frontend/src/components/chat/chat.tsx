"use client";

import { useState, useRef, useEffect } from "react";
import { Message as MessageType } from "@/types/chat";
import { ChatInput } from "./chat-input";
import { ChatHeader } from "./chat-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { sendChatMessage } from "@/lib/api/chatbot-api";
import { Message } from "./message";
import { v4 as uuidv4 } from "uuid";
import { TypingIndicator } from "./typing-indicator";
import { useChatStore } from "@/store/use-chat-store";
import Image from "next/image";

export function Chat() {
  const { threadId, setThreadId, messages, setMessages } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // update timestamp of welcome message only when mount for the first time
    if (
      messages.length === 1 &&
      messages[0].id === "welcome" &&
      messages[0].timestamp === "2024-01-01T00:00:00.000Z" &&
      localStorage.getItem("chat-storage") === null
    ) {
      setMessages([
        {
          ...messages[0],
          timestamp: new Date().toISOString(),
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async (content: string) => {
    if (isLoading) return;

    setError(null);

    const userMessage: MessageType = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    // combine all history + new message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // send all history to GPT API
      const apiMessages = updatedMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
      const response = await sendChatMessage(apiMessages, threadId);

      if (response.thread_id) setThreadId(response.thread_id);

      setMessages([
        ...updatedMessages,
        {
          id: uuidv4(),
          role: "assistant",
          content: response.reply,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to get a response. Please try again.";
      setError(errorMessage);
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "สวัสดีค่ะ ฉันคือ Khun HR ผู้ช่วยสัมภาษณ์อัจฉริยะจากนกแอร์ ยินดีต้อนรับและขอขอบคุณที่ให้ความสนใจร่วมงานกับเรา ก่อนที่เราจะเริ่มพูดคุยกันอย่างเป็นทางการ ขอทราบชื่อ-นามสกุล ตำแหน่งที่คุณสนใจ และเหตุผลที่เลือกสมัครกับนกแอร์หน่อยได้ไหมคะ? อยากให้วันนี้เป็นการพูดคุยที่สบายๆ เหมือนนั่งคุยกันบนเครื่องบินเลยค่ะ",
        timestamp: new Date().toISOString(),
      },
    ]);
    setError(null);
    setThreadId("");
  };

  return (
    <div className="flex flex-col h-[100dvh] relative bg-[#fffbe6]">
      {/* พื้นหลังเครื่องบินจางๆ */}
      <Image
        src="/plane.jpg"
        alt="Nok Air Plane"
        fill
        className="object-cover opacity-10 pointer-events-none select-none z-0"
        style={{ objectPosition: "center" }}
        priority
      />
      <div className="relative z-10 h-full flex flex-col">
        <ChatHeader onReset={handleReset} />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}

            {isLoading && <TypingIndicator />}

            {error && (
              <Alert variant="destructive" className="mx-4 my-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}
