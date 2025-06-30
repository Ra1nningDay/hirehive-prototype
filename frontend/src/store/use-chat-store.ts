import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Message } from "@/types/chat";

interface ChatState {
  threadId?: string;
  messages: Message[];
  setThreadId: (id: string) => void;
  setMessages: (msgs: Message[]) => void;
}

const defaultWelcome: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "สวัสดีค่ะ ฉันคือ Khun HR ผู้ช่วยสัมภาษณ์อัจฉริยะจากนกแอร์ ยินดีต้อนรับและขอขอบคุณที่ให้ความสนใจร่วมงานกับเรา ก่อนที่เราจะเริ่มพูดคุยกันอย่างเป็นทางการ ขอทราบชื่อ-นามสกุล ตำแหน่งที่คุณสนใจ และเหตุผลที่เลือกสมัครกับนกแอร์หน่อยได้ไหมคะ? อยากให้วันนี้เป็นการพูดคุยที่สบายๆ เหมือนนั่งคุยกันบนเครื่องบินเลยค่ะ",
    timestamp: "2024-01-01T00:00:00.000Z",
  },
];

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      threadId: undefined,
      messages: defaultWelcome,
      setThreadId: (id) => set({ threadId: id }),
      setMessages: (msgs) => set({ messages: msgs }),
    }),
    { name: "chat-storage" }
  )
);
