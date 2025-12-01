import { tool } from "ai";
import { z } from "zod";

export const flowchartTool = tool({
  description:
    "Generate a course flowchart showing prerequisites and course sequences. Use this when the student asks about course pathways, degree planning, or wants to visualize course relationships.",
  inputSchema: z.object({
    courses: z.array(
      z.object({
        id: z.string().describe("Course ID (e.g., CS010A)"),
        name: z.string().describe("Course name"),
        prerequisites: z
          .array(z.string())
          .describe("Array of prerequisite course IDs"),
        semester: z
          .number()
          .optional()
          .describe("Suggested semester to take this course"),
      })
    ),
    title: z.string().describe("Title for the flowchart"),
  }),
  execute: async ({ courses, title }) => {
    // Return structured data that the client will use to render a flowchart
    return {
      type: "flowchart",
      title,
      courses,
    };
  },
});

