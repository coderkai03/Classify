"use client";

import { useEffect } from "react";
import { useGemini } from "@/hooks/useGemini";

import ChatMessages from "@/components/chatbot/chat-messages";
import ChatInput from "@/components/chatbot/chat-input";

import { Message } from "@/types";

export default function Chatbot({
  setHomeMessage,
}: {
  setHomeMessage: (message: Message) => void;
}) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useGemini();

  useEffect(() => {
    setHomeMessage(messages.at(-2) as Message);
  }, [messages, setHomeMessage]);

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-xl overflow-hidden border border-red-500">
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
