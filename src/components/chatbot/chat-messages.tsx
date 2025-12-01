import { useEffect, useRef } from "react";
import ChatMessage from "@/components/chatbot/chat-message";
import { Skeleton } from "@/components/ui/skeleton";
import { AgentUIMessage } from "@/lib/agent";
import { FlowchartDisplay } from "@/components/tool-displays/flowchart-display";
import { TableDisplay } from "@/components/tool-displays/table-display";
import { InfoCardDisplay } from "@/components/tool-displays/info-card-display";

interface ChatMessagesProps {
  messages: AgentUIMessage[];
  status: "submitted" | "streaming" | "ready" | "error";
}

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

export default function ChatMessages({ messages, status }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderToolOutput = (part: unknown, key: string) => {
    // Type guard for tool parts
    const toolPart = part as { 
      type?: string; 
      state?: string; 
      output?: unknown;
    };
    
    // Handle tool invocations
    if (toolPart.type?.startsWith('tool-')) {
      // Only render if output is available
      if (toolPart.state === 'output-available' && toolPart.output) {
        const output = toolPart.output as ToolOutput;

        // Check the type of output and render appropriate component
        if (output.type === 'flowchart' && output.title && output.courses) {
          return (
            <FlowchartDisplay
              key={key}
              title={output.title}
              courses={output.courses}
            />
          );
        } else if (output.type === 'table' && output.title && output.headers && output.rows) {
          return (
            <TableDisplay
              key={key}
              title={output.title}
              headers={output.headers}
              rows={output.rows}
            />
          );
        } else if (output.type === 'info-card' && output.title && output.content && output.variant) {
          return (
            <InfoCardDisplay
              key={key}
              title={output.title}
              content={output.content}
              variant={output.variant}
              metadata={output.metadata}
            />
          );
        }
      }
      
      // Show loading state for tools
      if (toolPart.state === 'input-available') {
        return (
          <div key={key} className="my-2">
            <Skeleton className="w-full h-[100px] rounded-lg bg-blue-200" />
          </div>
        );
      }
    }
    
    return null;
  };

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-3 flex flex-col-reverse gap-1 scroll-smooth bg-blue-50"
      style={{ scrollbarWidth: "thin" }}
    >
      <div ref={messagesEndRef} />
      {(status === "streaming" || status === "submitted") && (
        <Skeleton className="w-[100px] h-[20px] rounded-full bg-blue-200" />
      )}
      {messages.length === 0 ? (
        <div className="h-full w-full flex justify-center items-center text-blue-700">
          Start typing!
        </div>
      ) : (
        messages
          .slice()
          .reverse()
          .map((message, index) => (
            message.parts.map((part, partIndex) => {
              const key = `${index}-${partIndex}`;
              
              if (part.type === "text") {
                return (
                  <ChatMessage 
                    key={key} 
                    text={part.text} 
                    role={message.role}
                  />
                );
              }
              
              // Render tool outputs
              return renderToolOutput(part, key);
            })
          ))
      )}
    </div>
  );
}