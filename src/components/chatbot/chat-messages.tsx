import { useEffect, useRef } from "react";
import ChatMessage from "@/components/chatbot/chat-message";
import { Skeleton } from "@/components/ui/skeleton";
import { AgentUIMessage } from "@/lib/agent";

interface ChatMessagesProps {
  messages: AgentUIMessage[];
  status: "submitted" | "streaming" | "ready" | "error";
}

export default function ChatMessages({ messages, status }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
            message.parts.map((part, partIndex) => (
              part.type === "text" ? (
                <ChatMessage 
                  key={`${index}-${partIndex}`} 
                  text={part.text} 
                  role={message.role}
                />
              ) : null
            ))
          ))
      )}
    </div>
  );
}