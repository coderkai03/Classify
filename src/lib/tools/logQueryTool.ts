import { tool } from "ai";
import { z } from "zod";

// Tool definition for logging user queries using Vercel AI SDK
export const logQueryTool = tool({
  description: "Logs the user's query for debugging and analytics purposes",
  inputSchema: z.object({
    query: z.string().describe("The user's query to log"),
  }),
  execute: async ({ query }) => {
    console.log("🔍 User Query Logged:", query);
    return {
      success: true,
      message: "Query logged successfully",
      query,
    };
  },
});

