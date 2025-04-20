"use client";

import Chatbot from "@/components/chatbot/chatbot";
import Flowchart from "@/components/flowchart/flowchart";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useEffect } from "react";
import { useGemini } from "@/hooks/useGemini";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useGemini();

  useEffect(() => {
    console.log(messages.at(-1)?.content)
  }, [messages])

  return (
    <main className="flex-1 flex overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="flex-1 min-w-0">
        <ResizablePanel
          defaultSize={36}
          minSize={24}
          maxSize={60}
          className="flex flex-col min-h-0"
        >
          <div className="flex-1 min-h-0 h-full p-4">
            <Chatbot
              messages={messages}
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-gray-200" />
        <ResizablePanel
          defaultSize={64}
          minSize={36}
          className="flex flex-col min-h-0"
        >
          <div className="flex-1 min-h-0 h-full p-4">
            <Flowchart />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
