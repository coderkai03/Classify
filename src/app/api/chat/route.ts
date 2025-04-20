import { GoogleGenAI } from "@google/genai";
import courseData from "@/data/ucr_courses.json";
import majorReqs from "@/data/cs-major-reqs.json";

export async function POST(req: Request) {
    const { messages } = await req.json();
    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY });

    // Get the latest user message
    const latestMessage = messages[messages.length - 1];
    console.log("Received messages:", messages); // Debug log
    console.log("Latest message:", latestMessage); // Debug log

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: 
            "Here is the student's course history and/or concerns: " + 
            latestMessage.content + 
            ".\n\nDetermine which courses the student should take next. " +
            "Use the following UCR major requirements + course catalog to help you make your decision. If the future courses have prerequisites that the student has not yet taken, include those in the upcoming courses. Assume the student has completed prerequisites for the courses they have taken: " + 
            "\n\nMajor Requirements: " + 
            majorReqs.text + 
            "\n\nCourse Catalog: " + 
            JSON.stringify(courseData),
        config: {
            systemInstruction: "You are a college counselor. You are given a student's course history and you need to help them choose the best remaining courses to take.",
        },
    });

    const aiResponse = { role: "assistant", content: response.text };
    console.log("Sending response:", aiResponse); // Debug log

    return new Response(
        JSON.stringify(aiResponse),
        { headers: { 'Content-Type': 'application/json' } }
    );
}