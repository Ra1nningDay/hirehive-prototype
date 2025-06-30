// import { useState } from "react";
// import { sendChatMessage } from "../lib/api/chatbot-api";

// export default function useChatbot() {
//   const [messages, setMessages] = useState<
//     { role: "user" | "bot"; text: string }[]
//   >([]);
//   const [input, setInput] = useState("");

//   const handleSend = async () => {
//     if (!input.trim()) return;
//     setMessages([...messages, { role: "user", text: input }]);
//     setInput("");

//     const data = await sendChatMessage(input);
//     setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
//   };

//   return { messages, input, setInput, handleSend };
// }
