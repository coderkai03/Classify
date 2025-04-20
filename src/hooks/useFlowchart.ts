import courseData from "@/data/ucr-courses.json";

export function useFlowchart({ data }: { data: string }) {
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
      target: node.id
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
  const LEVEL_HEIGHT = 150;
  const LEVEL_WIDTH = 250;

  // Second pass: position nodes based on their level
  mappedNodes.forEach(node => {
    const level = nodeLevels.get(node.id)!;
    const nodesInLevel = nodesByLevel.get(level)!;
    const indexInLevel = nodesInLevel.indexOf(node.id);
    
    node.position = {
      x: 100 + (indexInLevel * LEVEL_WIDTH),
      y: 100 + ((maxLevel - level) * LEVEL_HEIGHT) // Reverse Y to have prerequisites at top
    };
  });

  return { nodes: mappedNodes, edges: mappedEdges };
}