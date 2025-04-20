export interface Courses {
  [id: string]: Course;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  prerequisites?: PrereqTree | PrereqCourse;
  upcoming?: string[];
}

export interface PrereqTree {
  type: "AND" | "OR";
  children: (PrereqTree | PrereqCourse)[];
}

export interface PrereqCourse {
  id: string;
  isCoreq: boolean;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}