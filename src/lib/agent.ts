import { openai } from "@ai-sdk/openai";
import { logQueryTool } from "./tools/logQueryTool";
import {
    Experimental_Agent as Agent,
    Experimental_InferAgentUIMessage as InferAgentUIMessage,
} from "ai";
import majorRequirements from "@/data/ucr-major-reqs.json";
import courseData from "@/data/ucr-courses.json";

// Build the system prompt
const systemPrompt = `You are a college counselor. Help the student plan their next courses.

Here are the UCR major requirements and course catalog to help you make your decision:

Major Requirements:
${JSON.stringify(majorRequirements)}

Course Catalog:
${JSON.stringify(courseData)}

Important notes:
1. If the student has not yet taken a prerequisite or corequisite for a course, include that course in the upcoming courses.
2. Consider course conditions (e.g. course X AND course Y or course Z OR course W).
3. Assume the student has taken all prerequisites for the courses they are taking.

Return ONLY a JSON array of course IDs that the student should take next. Include the course(s) mentioned in the student's message.`;

export const agent = new Agent({
    model: openai('gpt-4o'),
    system: systemPrompt,
    tools: {
    logUserQuery: logQueryTool,
    },
});

// Infer the UIMessage type for UI components or persistence
export type AgentUIMessage = InferAgentUIMessage<typeof agent>;