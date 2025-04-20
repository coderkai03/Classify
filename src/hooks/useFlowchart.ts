import courseData from "@/data/ucr-courses.json";
import { MarkerType } from "@xyflow/react";

export function useFlowchart({ data }: { data: string }) {
  console.log("\n\n");
  console.log(data);
  console.log("\n\n");
  if (data === "" || data[0] !== "[") return { nodes: [], edges: [] };

  const renderCourseInfo = (content: string) => {
    try {
      const courseIds = JSON.parse(content) as string[];
      if (!Array.isArray(courseIds)) return content;

      const courseInfo = courseIds
        .map((id) => {
          const course = (courseData as Courses)[id];
          if (!course) {
            return `${id}: Refer to full UCR course catalog for course details\n\n`;
          }
          return `${course.id}: ${course.title}\n${course.description}\n\n`;
        })
        .join("");

      return courseInfo || content;
    } catch (e) {
      console.error(e);
      return content;
    }
  };

  const courseIds = renderCourseInfo(data);
  const courseList = courseIds.split("\n\n").filter(Boolean);
  const mappedNodes = courseList.map((course, index) => {
    const [header] = course.split("\n");
    const [id, title] = header.split(": ");

    return {
      id: id,
      position: { x: 100 + (index * 200), y: 100 + (index * 50) },
      data: { label: `${id}\n${title}` }
    };
  });

  const mappedEdges = mappedNodes.flatMap((node) => {
    const course = (courseData as Courses)[node.id];
    if (!course?.prerequisites) return [];
    
    const getPrereqIds = (prereq: PrereqTree | PrereqCourse): string[] => {
      if ('id' in prereq) return [prereq.id];
      return prereq.children.flatMap(getPrereqIds);
    };

    const prereqIds = getPrereqIds(course.prerequisites);
    return prereqIds.map(prereqId => ({
      id: `e${prereqId}-${node.id}`,
      source: prereqId,
      target: node.id,
      type: "smoothstep",
      animated: true,
      markerStart: {
        type: MarkerType.ArrowClosed,
        color: "#000000",
        width: 20,
        height: 20,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#000000",
        width: 20,
        height: 20,
      },
    }));
  });

  // Calculate node levels based on prerequisites
  const getNodeLevel = (courseId: string, visited = new Set<string>()): number => {
    if (visited.has(courseId)) return 0; // Handle circular dependencies
    visited.add(courseId);
    
    const course = (courseData as Courses)[courseId];
    if (!course?.prerequisites) return 0;
    
    const getPrereqIds = (prereq: PrereqTree | PrereqCourse): string[] => {
      if ('id' in prereq) return [prereq.id];
      return prereq.children.flatMap(getPrereqIds);
    };
    
    const prereqIds = getPrereqIds(course.prerequisites);
    const prereqLevels = prereqIds.map(id => getNodeLevel(id, new Set(visited)));
    return Math.max(...prereqLevels, -1) + 1;
  };

  const nodeLevels = new Map<string, number>();
  const nodesByLevel = new Map<number, string[]>();
  
  // First pass: calculate levels for all nodes
  mappedNodes.forEach(node => {
    const level = getNodeLevel(node.id);
    nodeLevels.set(node.id, level);
    
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level)!.push(node.id);
  });

  const maxLevel = Math.max(...Array.from(nodeLevels.values()));
  const LEVEL_HEIGHT = 250;
  const LEVEL_WIDTH = 350;
  const INITIAL_PADDING = 100;

  // Second pass: position nodes based on their level
  mappedNodes.forEach(node => {
    const level = nodeLevels.get(node.id)!;
    const nodesInLevel = nodesByLevel.get(level)!;
    const indexInLevel = nodesInLevel.indexOf(node.id);
    
    node.position = {
      x: INITIAL_PADDING + (indexInLevel * LEVEL_WIDTH),
      y: INITIAL_PADDING + ((maxLevel - level) * LEVEL_HEIGHT)
    };
  });

  return { nodes: mappedNodes, edges: mappedEdges };
}