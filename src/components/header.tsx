import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-purple-900/30 bg-black/80 backdrop-blur-sm p-4 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Neon<span className="text-cyan-400">Chat</span>
        </h1>
        <div className="flex items-center gap-2 text-purple-400">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          <span className="text-sm font-medium">Powered by AI</span>
        </div>
      </div>
    </header>
  );
}
