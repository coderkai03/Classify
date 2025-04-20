import courseData from "@/data/ucr-courses.json";

export function useFlowchart() {
  const nodes = [
    {
      id: "1",
      position: { x: 100, y: 100 },
      data: { label: "Node 1" },
    },
    {
      id: "2",
      position: { x: 300, y: 100 },
      data: { label: "Node 2" },
    },
  ];

  const edges = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
    },
  ];

  return { nodes, edges };
}
