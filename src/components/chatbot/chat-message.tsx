import courseData from "@/data/ucr-courses.json";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  text: string;
  role: "user" | "assistant" | "system";
}

export default function ChatMessage({ text, role }: ChatMessageProps) {
  const isUser = role === "user";

  const renderCourseInfo = (content: string) => {
    // Only attempt to parse if content looks like JSON (starts with [ and ends with ])
    const trimmedContent = content.trim();
    if (!trimmedContent.startsWith('[') || !trimmedContent.endsWith(']')) {
      return content;
    }

    try {
      const courseIds = JSON.parse(content) as string[];
      if (!Array.isArray(courseIds)) return content;

      const upcoming: string[] = [];
      const other: string[] = [];

      courseIds.forEach((id) => {
        const course = (courseData as Courses)[id];
        if (course) {
          upcoming.push(`${course.id}: ${course.title}\n`);
        } else {
          other.push(`${id}\n`);
        }
      });

      let formattedContent = '';
      if (upcoming.length > 0) {
        formattedContent += "## Upcoming Courses\n\n" + upcoming.join("\n");
      }
      if (other.length > 0) {
        formattedContent += "\n\n## Other Courses\n\n" + "(Refer to full UCR course catalog for course details)\n\n" + other.join("\n");
      }

      return formattedContent || content;
    } catch {
      // Silently fail and return original content if JSON parsing fails
      return content;
    }
  };

  return (
    <div
      className={
        role === "user"
          ? "bg-white text-gray-900 self-end rounded-2xl px-4 py-2 mb-2 border border-blue-200 shadow-sm max-w-[80%]"
          : "bg-blue-100 text-gray-900 self-start rounded-2xl px-4 py-2 mb-2 border border-blue-200 shadow-sm max-w-[80%]"
      }
    >
      <ReactMarkdown>
        {isUser ? text : renderCourseInfo(text)}
      </ReactMarkdown>
    </div>
  );
}