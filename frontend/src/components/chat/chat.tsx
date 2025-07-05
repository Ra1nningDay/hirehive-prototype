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

export function Chat() {
  const {
    threadId,
    setThreadId,
    messages,
    setMessages,
    generateWelcomeMessage,
  } = useChatStore();
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
      const welcomeMessage = generateWelcomeMessage();
      setMessages([welcomeMessage]);
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
    const welcomeMessage = generateWelcomeMessage();
    setMessages([welcomeMessage]);
    setError(null);
    setThreadId("");
  };

  return (
    <div className="flex flex-col h-[100dvh] relative bg-gradient-to-br from-[#f1e6f0] via-[#f8f0f5] to-[#e8d5f0]">
      {/* พื้นหลังแบบ Playful */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Decorative shapes */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-[#f28b1b]/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-[#5c4394]/20 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-[#f28b1b]/10 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-[#5c4394]/15 rounded-full animate-bounce delay-1000"></div>
      </div>
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
