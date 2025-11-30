import { validateUIMessages } from "ai";
import { agent } from "@/lib/agent";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Get the latest user message
  const latestMessage = messages[messages.length - 1];
  console.log("Received messages:", messages); // Debug log
  console.log("Latest message:", latestMessage); // Debug log

  try {
    return agent.respond({
      messages: await validateUIMessages({ messages }),
    });

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
