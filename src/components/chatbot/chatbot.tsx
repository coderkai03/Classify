"use client";

import { useEffect } from "react";
import { useGemini } from "@/hooks/useGemini";

import ChatMessages from "@/components/chatbot/chat-messages";
import ChatInput from "@/components/chatbot/chat-input";

export default function Chatbot() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useGemini();

  useEffect(() => {
    console.log(messages.at(-1)?.content);
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-xl overflow-hidden border border-red-500">
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
      />
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
