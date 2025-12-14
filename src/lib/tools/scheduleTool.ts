import { tool } from "ai";
import { z } from "zod";

export const scheduleTool = tool({
  description:
    "Generate a course schedule showing courses organized by semester in a calendar view using react-big-calendar. Use this when the student asks about course schedules, semester planning, or wants to see courses organized by when they should be taken. The schedule will be displayed in a weekly calendar view with courses as calendar events.",
  inputSchema: z.object({
    courses: z.array(
      z.object({
        id: z.string().describe("Course ID (e.g., CS010A)"),
        name: z.string().describe("Course name"),
        prerequisites: z
          .array(z.string())
          .describe("Array of prerequisite course IDs"),
        semester: z
          .number()
          .describe("Semester number to take this course (e.g., 1, 2, 3)"),
        startTime: z
          .string()
          .optional()
          .describe("Start time in HH:mm format (e.g., '09:00'). Defaults to '09:00' if not provided"),
        endTime: z
          .string()
          .optional()
          .describe("End time in HH:mm format (e.g., '10:30'). Defaults to '10:30' if not provided"),
        daysOfWeek: z
          .array(z.number())
          .optional()
          .describe("Days of week (0=Sunday, 1=Monday, etc.). Defaults to [1,3,5] (Mon, Wed, Fri) if not provided"),
        color: z
          .string()
          .optional()
          .describe("Color for the course event in hex format (e.g., '#3b82f6'). Auto-assigned if not provided"),
      })
    ),
    title: z.string().describe("Title for the schedule"),
    startDate: z
      .string()
      .optional()
      .describe("Start date for the schedule in YYYY-MM-DD format. Defaults to current date if not provided"),
  }),
  execute: async ({ courses, title, startDate }) => {
    // Return structured data that the client will use to render a schedule with react-big-calendar
    return {
      type: "schedule",
      title,
      courses,
      startDate: startDate || new Date().toISOString().split('T')[0],
    };
  },
});

