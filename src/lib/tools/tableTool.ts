import { tool } from "ai";
import { z } from "zod";

export const tableTool = tool({
  description:
    "Display course information in a table format. Use this when comparing multiple courses, showing course details, or displaying structured course data.",
  inputSchema: z.object({
    title: z.string().describe("Title for the table"),
    headers: z.array(z.string()).describe("Column headers"),
    rows: z
      .array(z.array(z.string()))
      .describe("Array of rows, each row is an array of cell values"),
  }),
  execute: async ({ title, headers, rows }) => {
    // Return structured data that the client will use to render a table
    return {
      type: "table",
      title,
      headers,
      rows,
    };
  },
});

