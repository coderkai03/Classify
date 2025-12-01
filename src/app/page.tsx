"use client";

import Chatbot from "@/components/chatbot/chatbot";
import Flowchart from "@/components/flowchart/flowchart";
import { FlowchartDisplay } from "@/components/tool-displays/flowchart-display";
import { TableDisplay } from "@/components/tool-displays/table-display";
// import { InfoCardDisplay } from "@/components/tool-displays/info-card-display";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

import { useState } from "react";
import { AgentUIMessage } from "@/lib/agent";

interface ToolOutput {
  type?: string;
  title?: string;
  courses?: Array<{
    id: string;
    name: string;
    prerequisites: string[];
    semester?: number;
  }>;
  headers?: string[];
  rows?: string[][];
  content?: string;
  variant?: 'info' | 'warning' | 'success' | 'error';
  metadata?: Record<string, string>;
}

export default function Home() {
  const [homeMessage, setHomeMessage] = useState<AgentUIMessage | null>(null);
  const [prevMessage, setPrevMessage] = useState<AgentUIMessage | null>(null);

  // Helper function to extract text content from AgentUIMessage
  const getMessageContent = (message: AgentUIMessage | null): string => {
    if (!message) return "";
    
    return message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join(" ");
  };

  // Helper function to extract tool outputs from messages
  const getToolOutputs = (message: AgentUIMessage | null): ToolOutput[] => {
    if (!message) return [];
    
    return message.parts
      .filter((part) => {
        const toolPart = part as { type?: string; state?: string; output?: unknown };
        return toolPart.type?.startsWith('tool-') && 
               toolPart.state === 'output-available' && 
               toolPart.output;
      })
      .map((part) => {
        const toolPart = part as { output: unknown };
        return toolPart.output as ToolOutput;
      });
  };

  // Render visualization panel content
  const renderVisualization = () => {
    const toolOutputs = getToolOutputs(homeMessage);
    
    // If there are tool outputs, render them instead of the flowchart
    if (toolOutputs.length > 0) {
      return (
        <div className="flex-1 overflow-auto bg-white rounded-xl p-6 border border-blue-300 shadow-md">
          {toolOutputs.map((output, index) => {
            if (output.type === 'flowchart' && output.title && output.courses) {
              return (
                <FlowchartDisplay
                  key={index}
                  title={output.title}
                  courses={output.courses}
                />
              );
            }
            else if (output.type === 'table' && output.title && output.headers && output.rows) {
              return (
                <TableDisplay
                  key={index}
                  title={output.title}
                  headers={output.headers}
                  rows={output.rows}
                />
              );
            }
            // else if (output.type === 'info-card' && output.title && output.content && output.variant) {
            //   return (
            //     <InfoCardDisplay
            //       key={index}
            //       title={output.title}
            //       content={output.content}
            //       variant={output.variant}
            //       metadata={output.metadata}
            //     />
            //   );
            // }
            return null;
          })}
        </div>
      );
    }
    
    // Otherwise, show the default flowchart
    return (
      <Flowchart
        data={getMessageContent(homeMessage)}
        prev={getMessageContent(prevMessage)}
      />
    );
  };

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
            <Chatbot
              setHomeMessage={setHomeMessage}
              setPrevMessage={setPrevMessage}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-blue-300" />
        <ResizablePanel
          defaultSize={64}
          minSize={36}
          className="flex flex-col min-h-0"
        >
          <div className="flex-1 min-h-0 h-full p-4">
            {renderVisualization()}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}