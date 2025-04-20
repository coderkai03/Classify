import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Panel, useReactFlow, Controls } from "@xyflow/react"
import { ZoomIn, ZoomOut, Maximize2, RefreshCw } from "lucide-react"

export function FlowchartControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const handleLayout = () => {
    fitView({ padding: 0.2, duration: 800 });
  };

  return (
    <Panel position="top-right" className="p-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => zoomIn()}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => zoomOut()}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => fitView({ padding: 0.2, duration: 800 })}
            title="Fit View"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleLayout}
            title="Auto Layout"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
    </Panel>
  )
} 