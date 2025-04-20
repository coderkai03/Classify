//! If we need to parse the course descriptions more than just the large paragraph, then do the following: for each course, use ChatGPT to parse the raw course data (in ucr_courses.json) into RawCourse. Then, use ChatGPT to create a ParsedCourse for each course, based on the overall data.

interface MinimumRawCourse {
  id: string; // the course ID, e.g. "CS 108"
  title: string; // the course title, e.g. "Data Science Ethics"
  description: string; // the description of the course, e.g. "Covers ethics specifically related to data science. Topics include data privacy; data curation and storage; discrimination and bias arising in the machine learning process; statistical topics such as generalization, causality, curse of dimensionality, and sampling bias; data communication; and strategies for conceptualizing, measuring, and mitigating problems in data-driven decisionmaking."
}

interface RawCourse extends MinimumRawCourse {
  department: string; // the course department, e.g. "CS"
  courseNumber: string; // the course number, e.g. "108"
  college: string; // the courses' parent college/school, e.g. "Bourns College of Engineering"
  numUnits: number; // the number of units given by the course, e.g. 4
  overlaps?: string[]; // the list of courses that overlap in content with this course (not applicable in this example)
  sameAs?: string[]; // the list of courses that are the same as this course, but are cross-listed under a different department, e.g. ["STAT 108"]
  concurrent?: string[]; // the list of courses that are concurrent with this course, meaning similar content but different levels (e.g. undergrad vs. grad) (not applicable in this example)
  contentLength?: string; // the length of the course, in hours, e.g. "Lecture, 3 hours; discussion, 1 hour."
  repeatability?: string; // how often the course can be taken for credit (not applicable in this example)
  gradingOption?: string; // how the course is graded (e.g. letter grade, pass/no pass (P/NP), etc.) (note that Satisfactory/No Credit (S/NC) is the same as P/NP), e.g. "Letter grade"
  restriction?: string; // restrictions on taking the course (not applicable in this example) (not applicable in this example)
  creditFor?: string[]; // a string describing which courses can be given credit by this course, e.g.
}

interface Course extends RawCourse {
  prereqs: PrereqTree; // the tree of prerequisites for the course, e.g. { "OR", "CS 105, STAT 107, CS 171" }
  requiredCoreqs?: string[]; // the list of courses that must be taken at the same time (not applicable in this example)
  dependencies?: string[]; // the list of courses that require this course as a prerequisite (not applicable in this example)
}

interface Courses {
  [courseId: string]: Course;
}

interface PrereqTree {
  type: "AND" | "OR" | "NOT";
  children: (PrereqTree | PrereqCourse | PrereqExam)[];
}

interface PrereqCourse {
  prereqType: "course";
  coreq: boolean;
  courseId: string;
  minGrade?: string;
}

interface PrereqExam {
  prereqType: "exam";
  examName: string;
  minGrade?: string;
}
