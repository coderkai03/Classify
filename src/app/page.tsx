"use client";

import Chatbot from "@/components/chatbot/chatbot";
import Flowchart from "@/components/flowchart/flowchart";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

import { useState } from "react";

export default function Home() {
  const [homeMessage, setHomeMessage] = useState<Message | null>(null);
  const [prevMessage, setPrevMessage] = useState<Message | null>(null);
  return (
    <main className="flex-1 flex overflow-hidden bg-gradient-to-br from-blue-50 to-blue-300">
      <ResizablePanelGroup direction="horizontal" className="flex-1 min-w-0">
        <ResizablePanel
          defaultSize={36}
          minSize={24}
          maxSize={60}
          className="flex flex-col min-h-0"
        >
          <div className="flex-1 min-h-0 h-full p-4">
            <Chatbot setHomeMessage={setHomeMessage} setPrevMessage={setPrevMessage} />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-blue-300" />
        <ResizablePanel
          defaultSize={64}
          minSize={36}
          className="flex flex-col min-h-0"
        >
          <div className="flex-1 min-h-0 h-full p-4">
            <Flowchart data={homeMessage?.content || ""} prev={prevMessage?.content || ""} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}