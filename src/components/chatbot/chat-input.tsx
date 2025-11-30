"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { AgentUIMessage } from "@/lib/agent";

interface ChatInputProps {
  sendMessage: ReturnType<typeof useChat<AgentUIMessage>>["sendMessage"];
  status: "submitted" | "streaming" | "ready" | "error";
}

export default function ChatInput({
  sendMessage,
  status,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ parts: [{ type: "text", text: input }] });
      setInput("");
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-blue-200 px-4 py-4 bg-blue-100 flex items-center gap-2"
    >
      <Input
        value={input}
        onChange={handleInputChange}
        disabled={status === "streaming" || status === "submitted"}
        placeholder="Type your message..."
        className="flex-1 bg-white shadow-sm border-blue-200"
      />
      <Button
        type="submit"
        size="icon"
        className="ml-1 bg-blue-500 hover:bg-blue-600"
        variant="default"
        aria-label="Send"
        disabled={status === "streaming" || status === "submitted" || input.trim() === ""}
      >
        <Send size={20} />
      </Button>
    </form>
  );
}