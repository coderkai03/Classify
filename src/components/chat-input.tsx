"use client"

import type { FormEvent, ChangeEvent } from "react"
import { SendHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}

export default function ChatInput({ input, handleInputChange, handleSubmit, isLoading }: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <div className="relative flex-1">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="w-full p-4 pr-12 rounded-lg bg-purple-950/20 border border-purple-700/30 text-white placeholder-purple-400/70 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          disabled={isLoading}
        />
        <div className="absolute inset-0 rounded-lg pointer-events-none shadow-[0_0_5px_rgba(168,85,247,0.3)] opacity-70"></div>
      </div>

      <Button
        type="submit"
        size="icon"
        disabled={isLoading || input.trim() === ""}
        className="absolute right-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-2 shadow-[0_0_10px_rgba(168,85,247,0.5)] hover:shadow-[0_0_15px_rgba(168,85,247,0.7)] transition-all duration-300"
      >
        <SendHorizontal className="h-5 w-5 text-white" />
      </Button>
    </form>
  )
}
