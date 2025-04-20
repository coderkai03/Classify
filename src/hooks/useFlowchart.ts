import courseData from "@/data/ucr-courses.json";
import { MarkerType } from "@xyflow/react";

// Add this type definition at the top of the file
type Node = {
  id: string;
  position: { x: number; y: number };
  data: { label: string };
};

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

  // Separate nodes into existing and non-existing courses
  const existingNodes: Node[] = [];
  const nonExistingNodes: Node[] = [];

  courseList.forEach((course, index) => {
    const [header] = course.split("\n");
    const [id, title] = header.split(": ");

    const node = {
      id: id,
      position: { x: 0, y: 0 }, // Initial position, will be updated later
      data: { label: `${id}\n${title}` },
    };

    // Check if course exists in courseData
    if ((courseData as Courses)[id]) {
      existingNodes.push(node);
    } else {
      nonExistingNodes.push(node);
    }
  });

  console.log("\n\n\n\n\nmappedNodes", existingNodes);

  const mappedEdges = existingNodes.flatMap((node) => {
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

  // Calculate levels only for existing nodes
  existingNodes.forEach((node) => {
    const level = getNodeLevel(node.id);
    nodeLevels.set(node.id, level);

    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level)!.push(node.id);
  });

  const maxLevel = Math.max(...Array.from(nodeLevels.values()), 0);
  const LEVEL_HEIGHT = 250;
  const LEVEL_WIDTH = 350;
  const INITIAL_PADDING = 100;
  const NON_EXISTING_COURSE_PADDING = 250; // Increased from 50 to 150

  // Position existing nodes horizontally by level
  existingNodes.forEach((node) => {
    const level = nodeLevels.get(node.id)!;
    const nodesInLevel = nodesByLevel.get(level)!;
    const indexInLevel = nodesInLevel.indexOf(node.id);

    node.position = {
      x: INITIAL_PADDING + (indexInLevel * LEVEL_WIDTH),
      y: INITIAL_PADDING + ((maxLevel - level) * LEVEL_HEIGHT)
    };
  });

  // Position non-existing nodes in a vertical stack on the right
  const rightmostX = Math.max(
    ...existingNodes.map(node => node.position.x),
    INITIAL_PADDING + LEVEL_WIDTH
  );
  
  nonExistingNodes.forEach((node, index) => {
    node.position = {
      x: rightmostX + LEVEL_WIDTH, // Place to the right of existing nodes
      y: INITIAL_PADDING + (index * NON_EXISTING_COURSE_PADDING) // Stack vertically
    };
  });

  // Combine the nodes back together
  const allNodes = [...existingNodes, ...nonExistingNodes];

  return { nodes: allNodes, edges: mappedEdges };
}
