"use client";

import { useEffect } from "react";
import { Message } from "ai";

import ChatMessages from "@/components/chatbot/chat-messages";
import ChatInput from "@/components/chatbot/chat-input";

interface ChatbotProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

export default function Chatbot({ messages, input, handleInputChange, handleSubmit, isLoading }: ChatbotProps) {
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
