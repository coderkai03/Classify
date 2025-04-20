import { ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useFlowchart } from "@/hooks/useFlowchart";

export default function Flowchart() {
  const { nodes, edges } = useFlowchart();

  return (
    <div className="h-full w-full rounded-lg p-4 bg-white text-black ">
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  );
}
