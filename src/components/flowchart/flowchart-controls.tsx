import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Panel } from "@xyflow/react"
import { ZoomIn, ZoomOut, Maximize2, RefreshCw } from "lucide-react"

interface FlowchartControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onFitView: () => void
  onLayout: () => void
}

export function FlowchartControls({
  onZoomIn,
  onZoomOut,
  onFitView,
  onLayout,
}: FlowchartControlsProps) {
  return (
    <Panel position="top-right" className="p-4">
      <Card>
        <CardContent className="p-2 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onZoomIn}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onZoomOut}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onFitView}
            title="Fit View"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onLayout}
            title="Auto Layout"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </Panel>
  )
} 