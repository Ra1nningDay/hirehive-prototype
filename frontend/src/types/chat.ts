export type Role = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
}

export interface ChatCompletionMessageParam {
  role: Role;
  content: string;
}
