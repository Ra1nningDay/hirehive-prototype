import { Message as MessageType } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/use-chat-store";

interface MessageProps {
  message: MessageType;
}

function removeMarkdown(text: string): string {
  // ลบ **, __, *, _ รอบๆข้อความ
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // **bold**
    .replace(/__(.*?)__/g, "$1") // __bold__
    .replace(/\*(.*?)\*/g, "$1") // *italic*
    .replace(/_(.*?)_/g, "$1"); // _italic_
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === "user";
  const router = useRouter();
  const { threadId } = useChatStore();

  // ตรวจจับข้อความสรุปการสัมภาษณ์
  const isSummary =
    message.role === "assistant" &&
    typeof message.content === "string" &&
    (/สรุป(การ)?สัมภาษณ์/.test(message.content) ||
      message.content.includes("สรุปและคำแนะนำ") ||
      message.content.trim().startsWith("สรุป"));

  const handleSummarizeClick = () => {
    if (threadId) {
      router.push(`/interview/summarize/${threadId}`);
    } else {
      router.push("/interview/summarize");
    }
  };

  return (
    <div
      className={cn(
        "flex w-full gap-3 p-4 animate-in slide-in-from-bottom-2 duration-300",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="relative">
          <Image
            src="/logo.png"
            alt="Hive AI Bot"
            width={20}
            height={20}
            className="relative h-10 w-10 rounded-full border-3 border-[#f28b1b] bg-white shadow-lg"
            priority
          />
        </div>
      )}

      <div className="flex flex-col gap-2 max-w-[80%]">
        <div
          className={cn(
            "rounded-2xl p-4 shadow-lg transform transition-all duration-200",
            isUser
              ? "bg-gradient-to-r from-[#f28b1b] to-[#ff9d3a] text-white ml-auto border-2 border-[#f28b1b]/30"
              : "bg-white border-2 border-[#5c4394]/20 shadow-[0_4px_20px_rgba(92,67,148,0.1)]"
          )}
        >
          <p className="text-sm font-medium whitespace-pre-wrap break-words leading-relaxed">
            {removeMarkdown(message.content)}
          </p>
        </div>
        {isSummary && (
          <button
            className="mt-2 px-6 py-3 bg-gradient-to-r from-[#5c4394] to-[#7b5bb0] text-white rounded-xl hover:from-[#5c4394]/90 hover:to-[#7b5bb0]/90 transition-all duration-300 font-bold text-sm shadow-lg transform hover:scale-105 animate-pulse"
            onClick={handleSummarizeClick}
          >
            🏆 ดูสรุปการสัมภาษณ์
          </button>
        )}
        <span className="text-xs text-muted-foreground font-semibold">
          {format(message.timestamp, "h:mm a")}
        </span>
      </div>

      {isUser && (
        <div className="relative">
          <Avatar className="relative h-10 w-10 bg-white rounded-full border-3 border-[#f28b1b] shadow-lg">
            <User className="h-6 w-6 text-[#5c4394]" />
          </Avatar>
        </div>
      )}
    </div>
  );
}
