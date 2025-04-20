interface Courses {
  [id: string]: Course;
}

interface Course {
  id: string;
  title: string;
  description: string;
  prerequisites: PrereqTree;
  upcoming: string[];
}

interface PrereqTree {
  type: "AND" | "OR";
  children: (PrereqTree | PrereqCourse)[];
}

interface PrereqCourse {
  id: string;
  isCoreq: boolean;
}