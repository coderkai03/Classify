"use client";

import Chatbot from "@/components/chatbot/chatbot";
import Flowchart from "@/components/flowchart/flowchart";
import { useGemini } from "@/hooks/useGemini";
import { useEffect } from "react";

// TODO add shadcn/ui resizable component here https://ui.shadcn.com/docs/components/resizable

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useGemini();

  useEffect(() => {
    console.log(messages.at(-1)?.content)
  }, [messages])

  return (
    <div className="flex h-full">
      <Chatbot
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
      <Flowchart />
    </div>
  );
}
