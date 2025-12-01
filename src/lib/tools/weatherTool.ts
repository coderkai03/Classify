import { tool } from "ai";
import { z } from "zod";

// Tool definition for logging user queries using Vercel AI SDK
export const weatherTool = tool({
  description: "Get the weather for a given location",
  inputSchema: z.object({
    location: z.string().describe("The location to get the weather for"),
  }),
  execute: async () => {
    const weather = ["sunny 80°F", "cloudy 60°F", "rainy 50°F", "snowy 30°F"];
    const randomWeather = weather[Math.floor(Math.random() * weather.length)];
    return {
      weather: randomWeather,
    };
  },
});

