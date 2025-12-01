'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Course {
  id: string;
  name: string;
  prerequisites: string[];
  semester?: number;
}

interface FlowchartDisplayProps {
  title: string;
  courses: Course[];
}

export function FlowchartDisplay({ title, courses }: FlowchartDisplayProps) {
  return (
    <Card className="w-full my-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-4 border rounded-lg bg-background hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{course.id}</Badge>
                    {course.semester && (
                      <Badge variant="secondary">Semester {course.semester}</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg">{course.name}</h3>
                  {course.prerequisites.length > 0 && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium">Prerequisites: </span>
                      {course.prerequisites.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

