'use client';

import {
  ReactFlow,
  Background,
  ReactFlowProvider,
  SmoothStepEdge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomNode } from "@/components/flowchart/custom-node";
import { FlowchartControls } from "@/components/flowchart/flowchart-controls";
import { CourseDialog } from "@/components/flowchart/course-dialog";
import courseData from "@/data/ucr-courses.json";

const nodeTypes = {
  custom: CustomNode,
};

interface PrerequisiteFlowchartDisplayProps {
  title: string;
  courseIds: string[];
}

export function PrerequisiteFlowchartDisplay({ title, courseIds }: PrerequisiteFlowchartDisplayProps) {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const { nodes, edges } = useMemo(() => {
    // Get all courses and their prerequisites/corequisites
    const allCourseIds = new Set<string>(courseIds);
    const processedCourses = new Set<string>();
    
    // Recursively add prerequisites
    const addPrerequisites = (courseId: string) => {
      if (processedCourses.has(courseId)) return;
      processedCourses.add(courseId);
      
      const course = (courseData as Courses)[courseId];
      if (!course?.prerequisites) return;

      const getPrereqIds = (prereq: PrereqTree | PrereqCourse): string[] => {
        if ("id" in prereq) {
          allCourseIds.add(prereq.id);
          return [prereq.id];
        }
        return prereq.children.flatMap(getPrereqIds);
      };

      const prereqIds = getPrereqIds(course.prerequisites);
      prereqIds.forEach(addPrerequisites);
    };

    // Add all prerequisites for the requested courses
    courseIds.forEach(addPrerequisites);

    // Create nodes
    const nodes = Array.from(allCourseIds).map((courseId, index) => {
      const course = (courseData as Courses)[courseId];
      return {
        id: courseId,
        position: { x: 0, y: 0 }, // Will be positioned later
        data: {
          id: courseId,
          title: course?.title || courseId,
          label: `${courseId}\n${course?.title || courseId}`,
        },
        type: "custom" as const,
      };
    });

    // Create edges based on prerequisites
    const edges: Array<{
      id: string;
      source: string;
      target: string;
      type: string;
      animated: boolean;
      markerStart?: { type: MarkerType; color: string; width: number; height: number };
      markerEnd?: { type: MarkerType; color: string; width: number; height: number };
      style?: { stroke: string };
    }> = [];

    nodes.forEach((node) => {
      const course = (courseData as Courses)[node.id];
      if (!course?.prerequisites) return;

      const getPrereqIds = (prereq: PrereqTree | PrereqCourse): Array<{ id: string; isCoreq: boolean }> => {
        if ("id" in prereq) {
          return [{ id: prereq.id, isCoreq: prereq.isCoreq }];
        }
        return prereq.children.flatMap(getPrereqIds);
      };

      const prereqs = getPrereqIds(course.prerequisites);
      prereqs.forEach((prereq) => {
        if (allCourseIds.has(prereq.id)) {
          edges.push({
            id: `e${prereq.id}-${node.id}`,
            source: prereq.id,
            target: node.id,
            type: "smoothstep",
            animated: true,
            style: {
              stroke: prereq.isCoreq ? "#3b82f6" : "#000000", // Blue for coreq, black for prereq
            },
            markerStart: {
              type: MarkerType.ArrowClosed,
              color: prereq.isCoreq ? "#3b82f6" : "#000000",
              width: 20,
              height: 20,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: prereq.isCoreq ? "#3b82f6" : "#000000",
              width: 20,
              height: 20,
            },
          });
        }
      });
    });

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
      const prereqLevels = prereqIds
        .filter(id => allCourseIds.has(id))
        .map((id) => getNodeLevel(id, new Set(visited)));
      return Math.max(...prereqLevels, -1) + 1;
    };

    const nodeLevels = new Map<string, number>();
    const nodesByLevel = new Map<number, string[]>();

    nodes.forEach((node) => {
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

    // Position nodes horizontally by level
    nodes.forEach((node) => {
      const level = nodeLevels.get(node.id)!;
      const nodesInLevel = nodesByLevel.get(level)!;
      const indexInLevel = nodesInLevel.indexOf(node.id);

      node.position = {
        x: INITIAL_PADDING + indexInLevel * LEVEL_WIDTH,
        y: INITIAL_PADDING + (maxLevel - level) * LEVEL_HEIGHT,
      };
    });

    return { nodes, edges };
  }, [courseIds]);

  return (
    <Card className="w-full my-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[800px] w-full rounded-xl border bg-background shadow-sm">
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              proOptions={{ hideAttribution: true }}
              edgeTypes={{ smoothstep: SmoothStepEdge }}
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
          </ReactFlowProvider>
          <CourseDialog
            courseId={selectedCourse}
            open={!!selectedCourse}
            onOpenChange={(open) => {
              if (!open) setSelectedCourse(null);
            }}
          />
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>💡 Blue edges indicate corequisites, black edges indicate prerequisites</p>
        </div>
      </CardContent>
    </Card>
  );
}

