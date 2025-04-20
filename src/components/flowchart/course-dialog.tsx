import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import courseData from "@/data/ucr-courses.json";

interface CourseDialogProps {
  courseId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseDialog({ courseId, open, onOpenChange }: CourseDialogProps) {
  const course = courseId ? (courseData as Courses)[courseId] : null;

  if (!course) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Content className="fixed right-5 top-50 max-h-[85vh] w-[400px] rounded-lg bg-white/95 backdrop-blur-sm p-6 shadow-xl focus:outline-none border border-gray-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-right-1/2 data-[state=open]:slide-in-from-right-1/2">
          <Dialog.Title className="text-lg font-semibold">
            {course.id}: {course.title}
          </Dialog.Title>
          <Dialog.Description className="mt-4 text-sm text-gray-600">
            {course.description}
          </Dialog.Description>
          {course.prerequisites && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Prerequisites</h3>
              <div className="text-sm text-gray-600">
                {renderPrerequisites(course.prerequisites)}
              </div>
            </div>
          )}
          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function renderPrerequisites(prereq: PrereqTree | PrereqCourse): string {
  if ('id' in prereq) {
    return prereq.id + (prereq.isCoreq ? ' (corequisite)' : '');
  }

  if (prereq.type === 'AND') {
    return prereq.children.map(child => renderPrerequisites(child)).join(' AND ');
  }

  if (prereq.type === 'OR') {
    return '(' + prereq.children.map(child => renderPrerequisites(child)).join(' OR ') + ')';
  }

  return '';
} 