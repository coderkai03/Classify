import { tool } from "ai";
import { z } from "zod";

export const flowchartTool = tool({
  description:
    "Generate a course flowchart showing prerequisites and corequisites relationships using a visual node graph. Use this when the student asks about course prerequisites, wants to visualize course dependencies, or needs to understand the flow of courses based on their requirements.",
  inputSchema: z.object({
    courseIds: z
      .array(z.string())
      .describe("Array of course IDs to include in the flowchart (e.g., ['CS010A', 'CS010B', 'CS010C'])"),
    title: z.string().optional().describe("Title for the flowchart"),
  }),
  execute: async ({ courseIds, title }) => {
    // Return structured data that the client will use to render a flowchart
    return {
      type: "flowchart",
      title: title || "Course Prerequisites Flow",
      courseIds,
    };
  },
});
