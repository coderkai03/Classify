import courseData from "@/data/ucr-courses.json";
import { MarkerType } from "@xyflow/react";

function findFirstSubstringInList(
  s: string | undefined,
  substrings: string[]
): string | null {
  if (!s) return null;
  for (let i = 0; i < s.length; i++) {
    for (let j = i + 1; j <= s.length; j++) {
      const substr = s.slice(i, j);
      if (substrings.includes(substr)) {
        return substr;
      }
    }
  }
  return null;
}

export function useFlowchart({ data, prev }: { data: string; prev: string }) {
  
  console.log("\n\n");
  console.log("data", data);
  console.log("prev", prev);
  console.log("\n\n");
  
  const mentionedCourse = findFirstSubstringInList(
    prev.toUpperCase(),
    Object.keys(courseData as Courses)
  );

  if (!mentionedCourse && (data === "" || data[0] !== "["))
    return { nodes: [], edges: [] };

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

  if (mentionedCourse) {
    data = '["' + mentionedCourse + '","' + data.slice(2, data.length);
  }

  const courseIds = renderCourseInfo(data);
  const courseList = courseIds.split("\n\n").filter(Boolean);
  const mappedNodes = courseList.map((course, index) => {
    const [header] = course.split("\n");
    const [id, title] = header.split(": ");

    return {
      id: id,
      position: { x: 100 + index * 200, y: 100 + index * 50 },
      data: { label: `${id}\n${title}` },
    };
  });

  console.log("\n\n\n\n\nmappedNodes", mappedNodes);

  const mappedEdges = mappedNodes.flatMap((node) => {
    const course = (courseData as Courses)[node.id];
    if (!course?.prerequisites) return [];

    const getPrereqIds = (prereq: PrereqTree | PrereqCourse): string[] => {
      if ("id" in prereq) return [prereq.id];
      return prereq.children.flatMap(getPrereqIds);
    };

    const prereqIds = getPrereqIds(course.prerequisites);
    return prereqIds.map((prereqId) => ({
      id: `e${prereqId}-${node.id}`,
      source: prereqId,
      target: node.id,
      type: "smoothstep",
      markerStart: {
        type: MarkerType.ArrowClosed,
        color: "#000000",
        width: 30,
        height: 30,
      },
    }));
  });

  console.log("mappedEdges", mappedEdges);

  // Calculate node levels based on prerequisites
  const getNodeLevel = (
    courseId: string,
    visited = new Set<string>()
  ): number => {
    if (visited.has(courseId)) return 0; // Handle circular dependencies
    visited.add(courseId);

    const course = (courseData as Courses)[courseId];
    if (!course?.prerequisites) return 0;

    const getPrereqIds = (prereq: PrereqTree | PrereqCourse): string[] => {
      if ("id" in prereq) return [prereq.id];
      return prereq.children.flatMap(getPrereqIds);
    };

    const prereqIds = getPrereqIds(course.prerequisites);
    const prereqLevels = prereqIds.map((id) =>
      getNodeLevel(id, new Set(visited))
    );
    return Math.max(...prereqLevels, -1) + 1;
  };

  const nodeLevels = new Map<string, number>();
  const nodesByLevel = new Map<number, string[]>();

  // First pass: calculate levels for all nodes
  mappedNodes.forEach((node) => {
    const level = getNodeLevel(node.id);
    nodeLevels.set(node.id, level);

    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level)!.push(node.id);
  });

  console.log("nodeLevels", nodeLevels);
  console.log("nodesByLevel", nodesByLevel);

  const maxLevel = Math.max(...Array.from(nodeLevels.values()));
  const LEVEL_HEIGHT = 150;
  const LEVEL_WIDTH = 250;

  // Second pass: position nodes based on their level
  mappedNodes.forEach((node) => {
    const level = nodeLevels.get(node.id)!;
    const nodesInLevel = nodesByLevel.get(level)!;
    const indexInLevel = nodesInLevel.indexOf(node.id);

    node.position = {
      x: 100 + indexInLevel * LEVEL_WIDTH,
      y: 100 + (maxLevel - level) * LEVEL_HEIGHT, // Reverse Y to have prerequisites at top
    };
  });

  console.log("mappedNodes", mappedNodes);

  return { nodes: mappedNodes, edges: mappedEdges };
}
