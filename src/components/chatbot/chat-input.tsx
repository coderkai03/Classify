"use client";

import type { FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export default function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: ChatInputProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-blue-200 px-4 py-4 bg-blue-100 flex items-center gap-2"
    >
      <Input
        value={input}
        onChange={handleInputChange}
        disabled={isLoading}
        placeholder="Type your message..."
        className="flex-1 bg-white shadow-sm border-blue-200 active:outline-blue-800 focus:outline-blue-800"
      />
      <Button
        type="submit"
        size="icon"
        className="ml-1 bg-blue-600 hover:bg-blue-700"
        variant="default"
        aria-label="Send"
        disabled={isLoading || input.trim() === ""}
      >
        <Send size={20} />
      </Button>
    </form>
  );
}