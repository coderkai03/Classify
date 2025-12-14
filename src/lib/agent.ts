import { openai } from "@ai-sdk/openai";
import { weatherTool } from "./tools/weatherTool";
import { scheduleTool } from "./tools/scheduleTool";
import { flowchartTool } from "./tools/flowchartTool";
import { tableTool } from "./tools/tableTool";
import { infoCardTool } from "./tools/infoCardTool";
import {
    Experimental_Agent as Agent,
    Experimental_InferAgentUIMessage as InferAgentUIMessage,
} from "ai";
import majorRequirements from "@/data/ucr-major-reqs.json";
import courseData from "@/data/ucr-courses.json";

// Build the system prompt
const systemPrompt = `You are a college counselor assistant with advanced visualization capabilities. Help students plan their courses using rich, interactive displays.

Here are the UCR major requirements and course catalog to help you make your decision:

Major Requirements:
${JSON.stringify(majorRequirements)}

Course Catalog:
${JSON.stringify(courseData)}

Important notes:
1. If the student has not yet taken a prerequisite or corequisite for a course, include that course in the upcoming courses.
2. Consider course conditions (e.g. course X AND course Y or course Z OR course W).
3. Assume the student has taken all prerequisites for the courses they are taking.

You have access to special tools to create rich visualizations:
- Use the 'generateSchedule' tool when students ask about course schedules, semester planning, or want to see courses organized by when they should be taken
- Use the 'generateFlowchart' tool when students ask about course prerequisites, want to visualize course dependencies, or need to understand the flow of courses based on their requirements
- Use the 'generateTable' tool when comparing courses, showing course details, or displaying structured data
- Use the 'generateInfoCard' tool to highlight important information, warnings, tips, or course requirements

Combine text responses with these visual tools to provide comprehensive, easy-to-understand guidance.`;

export const agent = new Agent({
    model: openai('gpt-4o'),
    system: systemPrompt,
    tools: {
        weather: weatherTool,
        generateSchedule: scheduleTool,
        generateFlowchart: flowchartTool,
        generateTable: tableTool,
        generateInfoCard: infoCardTool,
    },
});

// Infer the UIMessage type for UI components or persistence
export type AgentUIMessage = InferAgentUIMessage<typeof agent>;