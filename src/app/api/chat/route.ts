import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import courseData from "@/data/ucr-courses.json";
import majorRequirements from "@/data/ucr-major-reqs.json";
import { logQueryTool } from "@/lib/tools/logQueryTool";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Get the latest user message
  const latestMessage = messages[messages.length - 1];
  console.log("Received messages:", messages); // Debug log
  console.log("Latest message:", latestMessage); // Debug log

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

  try {
    const result = streamText({
      model: openai('gpt-4o'),
      system: systemPrompt,
      messages,
      tools: {
        logUserQuery: logQueryTool,
      }
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Failed to generate response:", error);
    return new Response(
      JSON.stringify({
        role: "assistant",
        content: "Error: Failed to generate course recommendations.",
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}
