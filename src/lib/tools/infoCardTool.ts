import { tool } from "ai";
import { z } from "zod";

export const infoCardTool = tool({
  description:
    "Display a highlighted information card with course details, warnings, tips, or important notices. Use this for emphasis or to draw attention to specific information.",
  inputSchema: z.object({
    title: z.string().describe("Card title"),
    content: z.string().describe("Main content of the card"),
    type: z
      .enum(["info", "warning", "success", "error"])
      .describe("Visual style of the card"),
    metadata: z
      .record(z.string())
      .optional()
      .describe("Additional metadata as key-value pairs"),
  }),
  execute: async ({ title, content, type, metadata }) => {
    // Return structured data that the client will use to render an info card
    return {
      type: "info-card",
      title,
      content,
      variant: type,
      metadata,
    };
  },
});

