import { Courses, PrereqTree, PrereqCourse } from "@/types";
import { ReactFlow, Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import courseData from "@/data/ucr-courses.json";

function buildPrerequisiteGraph(
  courseId: string,
  courses: Courses
): { nodes: Node[]; edges: Edge[] } {

  if (courseId === "" || !courses[courseId]) {
    return { nodes: [], edges: [] }; // Return empty graph if no courseId is provided
  }

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const processedCourses = new Set<string>();
  let xPosition = 0;

  // Process a course and add it to the graph
  function processCourse(id: string, depth: number = 0): void {
    // Skip if already processed
    if (processedCourses.has(id)) return;
    processedCourses.add(id);

    const course = courses[id];
    if (!course) return; // Course not found

    // Add node for this course
    nodes.push({
      id,
      data: { Label: course.title },
      position: { x: xPosition, y: depth * 100 },
    } as Node);
    xPosition += 150; // Shift x position for next node

    // Process prerequisites if they exist
    if (course.prerequisites) {
      processPrerequisites(id, course.prerequisites, depth + 1);
    }
  }

  // Process a prerequisite tree or course
  function processPrerequisites(
    targetId: string,
    prereq: PrereqTree | PrereqCourse,
    depth: number,
    groupId: string = ""
  ): void {
    if ("id" in prereq) {
      // It's a PrereqCourse
      const prereqId = prereq.id;

      // Process the prerequisite course
      processCourse(prereqId, depth);

      // Create edge from prerequisite to target
      const relationshipType = prereq.isCoreq ? "coreq" : "prereq";
      const logicalGroup = groupId ? groupId : relationshipType;

      edges.push({
        id: `e${prereqId}-${targetId}` as `e${string}-${string}`,
        source: prereqId,
        target: targetId,
        data: {
          type: relationshipType,
          logicalGroup: logicalGroup,
        },
      });
    } else {
      // It's a PrereqTree (AND/OR)
      // Generate a unique group identifier for this logical group
      const currentGroupId = `${prereq.type}-${Date.now()
        .toString(36)
        .slice(-5)}`;

      // Process each child of the tree
      prereq.children.forEach((child) => {
        if ("id" in child) {
          // Child is a PrereqCourse
          const childId = child.id;
          processCourse(childId, depth);

          // Connect child to target with the logical group identifier
          const relationshipType = child.isCoreq ? "coreq" : "prereq";

          edges.push({
            id: `e${childId}-${targetId}` as `e${string}-${string}`,
            source: childId,
            target: targetId,
            data: {
              type: relationshipType,
              logicalGroup: currentGroupId,
              logicalOperator: prereq.type, // AND or OR
            },
          });
        } else {
          // Child is another PrereqTree
          processPrerequisites(targetId, child, depth, currentGroupId);
        }
      });
    }
  }

  // Start with the requested course
  processCourse(courseId);

  return { nodes, edges };
}

export default function Flowchart({ data }: { data: string }) {
  console.log("\n\n\n\n");
  console.log("here");
  console.log("\n\n\n\n");
  console.log(data);
  const { nodes, edges } = buildPrerequisiteGraph(data, courseData as Courses);
  console.log(nodes);
  console.log(edges);
  console.log("\n\n\n\n");

  return (
    <div className="h-full w-full rounded-lg p-4 bg-white text-black border border-red-500">
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  );
}
