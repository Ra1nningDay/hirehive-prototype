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
        "flex w-full gap-3 p-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Image
          src="/logo.png"
          alt="Nok Air Logo"
          width={20}
          height={20}
          className="h-8 w-8 rounded-full border-2 border-yellow-400 bg-white shadow"
          priority
        />
      )}

      <div className="flex flex-col gap-1 max-w-[80%]">
        <div
          className={cn(
            "rounded-lg p-3",
            isUser ? "bg-white ml-auto" : "bg-white"
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {removeMarkdown(message.content)}
          </p>
        </div>
        {isSummary && (
          <button
            className="mt-2 px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition font-semibold text-sm"
            onClick={handleSummarizeClick}
          >
            ดูสรุปการสัมภาษณ์
          </button>
        )}
        <span className="text-xs text-muted-foreground">
          {format(message.timestamp, "h:mm a")}
        </span>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8  bg-white rounded-full border-2 border-yellow-400">
          <User className="h-7 w-7" />
        </Avatar>
      )}
    </div>
  );
}
