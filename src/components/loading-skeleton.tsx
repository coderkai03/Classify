import { Card } from "@/components/ui/card"

export default function LoadingSkeleton() {
  return (
    <div className="flex justify-start">
      <div className="flex gap-3 max-w-[80%]">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500/30 to-blue-500/30 animate-pulse flex-shrink-0"></div>

        <Card className="p-4 bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 border-cyan-700/20">
          <div className="flex flex-col gap-2">
            <div className="h-4 w-20 bg-cyan-700/20 rounded animate-pulse"></div>
            <div className="h-4 w-48 bg-cyan-700/20 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-cyan-700/20 rounded animate-pulse"></div>
          </div>
        </Card>
      </div>
    </div>
  )
}
