import courseData from "@/data/ucr-courses.json";
import ReactMarkdown from "react-markdown";

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  const renderCourseInfo = (content: string) => {
    try {
      const courseIds = JSON.parse(content) as string[];
      if (!Array.isArray(courseIds)) return content;

      const courseInfo = courseIds
        .map((id) => {
          const course = (courseData as Courses)[id];
          if (!course) {
            return `${id}: Refer to full UCR course catalog for course details\n\n`;
          }
          return `${course.id}: ${course.title}\n${course.description}\n\n`;
        })
        .join("");

      return courseInfo || content;
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