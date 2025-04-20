import { ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useFlowchart } from "@/hooks/useFlowchart";

export default function Flowchart({ data, prev }: { data: string,  prev: string }) {
  const { nodes, edges } = useFlowchart({ data, prev });

  return (
    <div className="h-full w-full rounded-lg p-4 bg-white text-black border border-red-500">
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  );
}
