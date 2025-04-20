import { GoogleGenAI, Type } from "@google/genai";
import courseData from "@/data/ucr-courses.json";
import majorRequirements from "@/data/ucr-major-reqs.json";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  });

  // Get the latest user message
  const latestMessage = messages[messages.length - 1];
  console.log("Received messages:", messages); // Debug log
  console.log("Latest message:", latestMessage); // Debug log

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents:
      "Here is the student's course history and/or concerns: " +
      latestMessage.content +
      "\n\nDetermine which courses the student should take next. Use the following UCR major requirements + course catalog to help you make your decision: " +
      "\n\nMajor Requirements: " +
      JSON.stringify(majorRequirements) +
      "\n\nCourse Catalog: " +
      JSON.stringify(courseData) +
      "\n\nImportant notes: " +
      "\n\n1. If the student has not yet taken a prerequisite or corequisite for a course, include that course in the upcoming courses. " +
      "\n\n2. Consider course conditions (e.g. course X AND course Y or course Z OR course W). " +
      "\n\n3. Assume the student has taken all prerequisites for the courses they are taking: " +
      "\n\nReturn ONLY a JSON array of course IDs that the student should take next. Include the course(s) mentioned in the student's message and a brief preface for the courses you recommend in the first index of the array.",
    config: {
      systemInstruction:
        "You are a college counselor. Help the student plan their next courses. Return ONLY a JSON array of course IDs, nothing else.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
          description: "Course ID (e.g., 'CS 100')",
        },
      },
    },
  });

  try {
    // Parse the AI response as JSON
    const parsedResponse = JSON.parse(response.text || "[]");
    const aiResponse = {
      role: "assistant",
      content: JSON.stringify(parsedResponse),
    };
    console.log("Sending response:", aiResponse); // Debug log

    return new Response(JSON.stringify(aiResponse), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return new Response(
      JSON.stringify({
        role: "assistant",
        content: "Error: Failed to generate course recommendations.",
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
}
