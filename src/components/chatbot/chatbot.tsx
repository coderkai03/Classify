"use client";

import { useEffect } from "react";
import { useChat } from "@ai-sdk/react";

import ChatMessages from "@/components/chatbot/chat-messages";
import ChatInput from "@/components/chatbot/chat-input";
import { AgentUIMessage } from "@/lib/agent";
import { DefaultChatTransport } from "ai";

export default function Chatbot({
  setHomeMessage,
  setPrevMessage,
}: {
  setHomeMessage: (message1: AgentUIMessage) => void;
  setPrevMessage: (message2: AgentUIMessage) => void;
}) {
  const {
    messages,
    sendMessage,
    status,
  } = useChat<AgentUIMessage>({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onError: (error: Error) => {
      console.error("Chat error:", error);
    },
  });

  useEffect(() => {
    setHomeMessage(messages.at(-1) as AgentUIMessage);
    setPrevMessage(messages.at(-2) as AgentUIMessage);
  }, [messages, setHomeMessage, setPrevMessage]);

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden border border-blue-300 shadow-md">
      <ChatMessages messages={messages} status={status} />
      <ChatInput
        sendMessage={sendMessage}
        status={status}
      />
    </div>
  );
}