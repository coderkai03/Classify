import {
  ReactFlow,
  Background,
  ReactFlowProvider,
  SmoothStepEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useState } from "react";

import { useFlowchart } from "@/hooks/useFlowchart";
import { CustomNode } from "./custom-node";
import { FlowchartControls } from "./flowchart-controls";
import { CourseDialog } from "./course-dialog";

const nodeTypes = {
  custom: CustomNode,
};

function FlowchartInner({ data, prev }: { data: string, prev: string }) {
  const { nodes, edges } = useFlowchart({ data, prev });
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const customNodes = nodes.map((node) => ({
    ...node,
    type: "custom",
    data: {
      ...node.data,
      id: node.id,
      title: node.data.label.split("\n")[1] || "",
    },
  }));

  return (
    <>
      <ReactFlow
        nodes={customNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        edgeTypes={{smoothstep: SmoothStepEdge}}
        onNodeClick={(event, node) => {
          setSelectedCourse(node.id);
        }}
      >
        <Background 
          color="hsl(var(--muted-foreground))"
          style={{ backgroundColor: 'hsl(var(--background))' }}
          className="size-20 dots gap-20"
        />
        <FlowchartControls />
      </ReactFlow>
      <CourseDialog 
        courseId={selectedCourse} 
        open={!!selectedCourse}
        onOpenChange={(open) => {
          if (!open) setSelectedCourse(null);
        }}
      />
    </>
  );
}

export default function Flowchart({
  data,
  prev,
}: {
  data: string;
  prev: string;
}) {
  return (
    <div className="h-[800px] w-full rounded-xl border bg-background shadow-sm">
      <ReactFlowProvider>
        <FlowchartInner data={data} prev={prev} />
      </ReactFlowProvider>
    </div>
  );
}
