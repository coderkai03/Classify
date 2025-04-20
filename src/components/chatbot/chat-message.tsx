import courseData from "@/data/ucr-courses.json";
import ReactMarkdown from "react-markdown";

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  const renderCourseInfo = (content: string) => {
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
        formattedContent += "## Upcoming Courses\n" + upcoming.join("\n");
      }
      if (other.length > 0) {
        formattedContent += "## \n\nOther Courses\n(Refer to full UCR course catalog for course details)\n" + other.join("\n");
      }

      return formattedContent || content;
    } catch (e) {
      console.error(e);
      return content;
    }
  };

  return (
    <div
      className={
        message.role === "user"
          ? "bg-white text-gray-900 self-end rounded-2xl px-4 py-2 mb-2 border border-blue-200 shadow-sm max-w-[80%]"
          : "bg-blue-100 text-gray-900 self-start rounded-2xl px-4 py-2 mb-2 border border-blue-200 shadow-sm max-w-[80%]"
      }
    >
      <ReactMarkdown>
        {isUser ? message.content : renderCourseInfo(message.content)}
      </ReactMarkdown>
    </div>
  );
}