"use client";

import { useEffect } from "react";
import { useGemini } from "@/hooks/useGemini";

import ChatMessages from "@/components/chatbot/chat-messages";
import ChatInput from "@/components/chatbot/chat-input";

export default function Chatbot({
  setHomeMessage,
  setPrevMessage
}: {
  setHomeMessage: (message1: Message) => void;
  setPrevMessage: (message2: Message) => void;
}) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useGemini();

  useEffect(() => {
    setHomeMessage(messages.at(-1) as Message);
    setPrevMessage(messages.at(-2) as Message);
  }, [messages, setHomeMessage, setPrevMessage]);

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
