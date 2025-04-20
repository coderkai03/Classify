"use client";

import { useEffect } from "react";
import { useGemini } from "@/hooks/useGemini";

import ChatMessage from "@/components/chatbot/chat-message";
import ChatInput from "@/components/chatbot/chat-input";
import LoadingSkeleton from "@/components/chatbot/loading-skeleton";

import { Sparkles } from "lucide-react";

export default function Chatbot() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useGemini();

  useEffect(() => {
    console.log(messages.at(-1)?.content);
  }, [messages]);

  return (
    <div>
      {/* Chat Section */}
      <div className="flex-1 overflow-auto p-4 max-w-4xl w-full mx-auto">
        <div className="space-y-6 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 p-1 mb-4 shadow-[0_0_15px_rgba(124,58,237,0.5)]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-purple-400" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Welcome to NeonChat
              </h2>
              <p className="text-purple-300 max-w-md">
                Ask me anything and I&apos;ll respond with neon-powered
                intelligence.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}

          {isLoading && <LoadingSkeleton />}

          {/* Scroll anchor */}
          <div className="h-1" id="chat-anchor" />
        </div>
      </div>

      {/* Input Section */}
      <div className="border-t border-purple-900/30 bg-black/80 backdrop-blur-sm p-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
