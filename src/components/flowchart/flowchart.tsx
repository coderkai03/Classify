import { ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useFlowchart } from "@/hooks/useFlowchart";

export default function Flowchart({ data, prev }: { data: string,  prev: string }) {
  const result = useFlowchart({ data, prev });
  
  if (typeof result === 'string') {
    return <div>Invalid data format</div>;
  }

  return (
    <div className="h-full w-full rounded-lg p-4 bg-white text-black border border-red-500">
      <ReactFlow nodes={result.nodes} edges={result.edges} />
    </div>
  );
}
