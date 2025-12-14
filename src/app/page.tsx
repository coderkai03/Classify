"use client";

import Chatbot from "@/components/chatbot/chatbot";
import Flowchart from "@/components/flowchart/flowchart";
import { ScheduleDisplay } from "@/components/tool-displays/schedule-display";
import { PrerequisiteFlowchartDisplay } from "@/components/tool-displays/prerequisite-flowchart-display";
import { TableDisplay } from "@/components/tool-displays/table-display";
// import { InfoCardDisplay } from "@/components/tool-displays/info-card-display";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { useState } from "react";
import { AgentUIMessage } from "@/lib/agent";

interface ToolOutput {
  type?: string;
  title?: string;
  courses?: Array<{
    id: string;
    name: string;
    prerequisites: string[];
    semester: number;
    startTime?: string;
    endTime?: string;
    daysOfWeek?: number[];
    color?: string;
  }>;
  courseIds?: string[];
  headers?: string[];
  rows?: string[][];
  content?: string;
  variant?: 'info' | 'warning' | 'success' | 'error';
  metadata?: Record<string, string>;
  startDate?: string;
}

export default function Home() {
  const [homeMessage, setHomeMessage] = useState<AgentUIMessage | null>(null);
  const [prevMessage, setPrevMessage] = useState<AgentUIMessage | null>(null);
  const [activeTab, setActiveTab] = useState<string>("schedule");

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
    
    // Separate tool outputs by type
    const scheduleOutputs = toolOutputs.filter(
      (output) => output.type === 'schedule'
    );
    const flowchartOutputs = toolOutputs.filter(
      (output) => output.type === 'flowchart'
    );
    const tableOutputs = toolOutputs.filter(
      (output) => output.type === 'table'
    );
    
    // Determine the current tab value - use activeTab if valid, otherwise default to first available
    const getCurrentTab = () => {
      const validTabs = [];
      if (scheduleOutputs.length > 0) validTabs.push("schedule");
      if (flowchartOutputs.length > 0) validTabs.push("flowchart");
      if (tableOutputs.length > 0) validTabs.push("table");
      
      if (validTabs.includes(activeTab)) {
        return activeTab;
      }
      return validTabs[0] || "schedule";
    };
    
    const currentTab = toolOutputs.length > 0 ? getCurrentTab() : activeTab;
    
    // If there are tool outputs, render them with tabs
    if (toolOutputs.length > 0) {
      return (
        <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-xl border border-blue-300 shadow-md">
          <Tabs value={currentTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            <div className="px-6 pt-6 pb-2 border-b">
              <TabsList>
                {scheduleOutputs.length > 0 && (
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                )}
                {flowchartOutputs.length > 0 && (
                  <TabsTrigger value="flowchart">Flowchart</TabsTrigger>
                )}
                {tableOutputs.length > 0 && (
                  <TabsTrigger value="table">Table</TabsTrigger>
                )}
              </TabsList>
            </div>
            <div className="flex-1 overflow-auto p-6">
              {scheduleOutputs.length > 0 && (
                <TabsContent value="schedule" className="mt-0">
                  {scheduleOutputs.map((output, index) => (
                    <ScheduleDisplay
                      key={index}
                      title={output.title || "Course Schedule"}
                      courses={output.courses || []}
                      startDate={output.startDate}
                    />
                  ))}
                </TabsContent>
              )}
              {flowchartOutputs.length > 0 && (
                <TabsContent value="flowchart" className="mt-0">
                  {flowchartOutputs.map((output, index) => (
                    <PrerequisiteFlowchartDisplay
                      key={index}
                      title={output.title || "Course Prerequisites Flow"}
                      courseIds={output.courseIds || []}
                    />
                  ))}
                </TabsContent>
              )}
              {tableOutputs.length > 0 && (
                <TabsContent value="table" className="mt-0">
                  {tableOutputs.map((output, index) => (
                    <TableDisplay
                      key={index}
                      title={output.title || "Table"}
                      headers={output.headers || []}
                      rows={output.rows || []}
                    />
                  ))}
                </TabsContent>
              )}
            </div>
          </Tabs>
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
          <div className="flex-1 min-h-0 h-full p-4 pb-20">
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