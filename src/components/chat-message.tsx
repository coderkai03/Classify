import type { Message } from "ai"
import { User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex gap-3 max-w-[80%]", isUser ? "flex-row-reverse" : "flex-row")}>
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
            isUser
              ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              : "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]",
          )}
        >
          {isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
        </div>

        <Card
          className={cn(
            "p-4 text-sm",
            isUser
              ? "bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-700/30 text-purple-50"
              : "bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 border-cyan-700/30 text-cyan-50",
          )}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
        </Card>
      </div>
    </div>
  )
}
