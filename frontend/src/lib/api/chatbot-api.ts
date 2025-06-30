import api from "./axios-instance";

type ChatMessage = { role: string; content: string };
type ChatPayload = {
  messages: ChatMessage[];
  thread_id?: string;
};

export async function sendChatMessage(
  messages: ChatMessage[],
  threadId?: string
) {
  const payload: ChatPayload = { messages };
  if (threadId) payload.thread_id = threadId;
  console.log("Sending chat message:", payload);
  const res = await api.post("/api/interview/chat", payload);
  if (!res.data) throw new Error("Failed to send message");
  return res.data;
}
