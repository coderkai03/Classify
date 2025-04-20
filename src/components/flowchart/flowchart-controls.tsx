import { Panel, useReactFlow } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2, RefreshCw } from "lucide-react";

export function FlowchartControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const handleLayout = () => {
    fitView({ padding: 0.2, duration: 800 });
  };

  return (
    <Panel position="top-right" className="flex flex-row gap-2 p-2">
      <Button
        variant="default"
        size="icon"
        onClick={() => zoomIn()}
        title="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>

      <Button
        variant="default"
        size="icon"
        onClick={() => zoomOut()}
        title="Zoom Out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>

      <Button
        variant="default"
        size="icon"
        onClick={() => fitView({ padding: 0.2, duration: 800 })}
        title="Fit View"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>

      <Button
        variant="default"
        size="icon"
        onClick={handleLayout}
        title="Auto Layout"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </Panel>
  );
}
