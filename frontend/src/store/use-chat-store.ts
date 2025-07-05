import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Message } from "@/types/chat";
import { JobPosition } from "@/types/job-positions";

interface UserSelection {
  selectedJob?: JobPosition;
  userInfo?: {
    name?: string;
    age?: string;
    strengths?: string;
    weaknesses?: string;
    previousJob?: string;
  };
}

interface ChatState {
  threadId?: string;
  messages: Message[];
  userSelection: UserSelection;
  setThreadId: (id: string) => void;
  setMessages: (msgs: Message[]) => void;
  setUserSelection: (selection: UserSelection) => void;
  generateWelcomeMessage: () => Message;
}

const defaultWelcome: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hello! I'm HIVE AI, your intelligent interview assistant. Welcome to the AI interview game! Before we start our formal conversation, could you please tell me your name, the position you're interested in, and your reason for applying for this position? I want today to be a comfortable but truly beneficial conversation.",
    timestamp: "2024-01-01T00:00:00.000Z",
  },
];

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      threadId: undefined,
      messages: defaultWelcome,
      userSelection: {},
      setThreadId: (id) => set({ threadId: id }),
      setMessages: (msgs) => set({ messages: msgs }),
      setUserSelection: (selection) =>
        set({ userSelection: { ...get().userSelection, ...selection } }),
      generateWelcomeMessage: () => {
        const { userSelection } = get();
        const { selectedJob, userInfo } = userSelection;

        let content =
          "Hello! I'm HIVE AI, your intelligent interview assistant. Welcome to the AI interview game! 🎯\n\n";

        if (selectedJob) {
          content += `I see that you're interested in the **${selectedJob.title}** position in **${selectedJob.subtitle}**, is that correct?\n\n`;
          content += `This position is very interesting indeed. `;
        }

        if (userInfo?.name) {
          content += `${userInfo.name}, `;
        }

        content += `today we'll have a formal conversation just like a real job interview.\n\n`;
        content += `Please answer the questions based on your real experience. Don't worry if you don't have perfect answers, because our goal is to learn and improve your interview skills! 💪\n\n`;
        content += `Are you ready to start? 🚀`;

        return {
          id: "welcome",
          role: "assistant",
          content,
          timestamp: new Date().toISOString(),
        };
      },
    }),
    { name: "chat-storage" }
  )
);
