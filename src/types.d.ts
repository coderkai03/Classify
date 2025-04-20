// Courses

interface Courses {
  [id: string]: Course;
}

interface Course {
  id: string;
  title: string;
  description: string;
  prerequisites?: PrereqTree | PrereqCourse;
  upcoming?: string[];
}

interface PrereqTree {
  type: "AND" | "OR";
  children: (PrereqTree | PrereqCourse)[];
}

interface PrereqCourse {
  id: string;
  isCoreq: boolean;
}

// Messages

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}