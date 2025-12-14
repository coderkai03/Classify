'use client';

import { useMemo, useState } from 'react';
import { Calendar, momentLocalizer, View, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const localizer = momentLocalizer(moment);

interface Course {
  id: string;
  name: string;
  prerequisites: string[];
  semester: number;
  startTime?: string;
  endTime?: string;
  daysOfWeek?: number[];
  color?: string;
}

interface ScheduleDisplayProps {
  title: string;
  courses: Course[];
  startDate?: string;
}

interface EventResource {
  courseId: string;
  courseName: string;
  semester: number;
  prerequisites: string[];
  color: string;
}

// Color palette for courses
const COURSE_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

export function ScheduleDisplay({ title, courses, startDate }: ScheduleDisplayProps) {
  const [currentView, setCurrentView] = useState<View>('week');
  const [currentDate, setCurrentDate] = useState<Date>(
    startDate ? new Date(startDate) : new Date()
  );

  // Create calendar events from courses
  const events = useMemo<Event[]>(() => {
    const baseDate = startDate ? new Date(startDate) : new Date();
    // Set to Monday of the week
    const dayOfWeek = baseDate.getDay();
    const diff = baseDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(baseDate.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    return courses.flatMap((course, courseIndex) => {
      const semester = course.semester;
      const startTime = course.startTime || '09:00';
      const endTime = course.endTime || '10:30';
      const daysOfWeek = course.daysOfWeek || [1, 3, 5]; // Mon, Wed, Fri by default
      const color = course.color || COURSE_COLORS[courseIndex % COURSE_COLORS.length];

      // Create events for each day of the week the course meets
      return daysOfWeek.map((day, dayIndex) => {
        const eventDate = new Date(monday);
        eventDate.setDate(monday.getDate() + day);
        
        // Offset by semester (each semester is roughly 16 weeks apart)
        const semesterOffset = (semester - 1) * 16 * 7; // weeks * 7 days
        eventDate.setDate(eventDate.getDate() + semesterOffset);

        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);

        const start = new Date(eventDate);
        start.setHours(startHour, startMin, 0, 0);

        const end = new Date(eventDate);
        end.setHours(endHour, endMin, 0, 0);

        return {
          id: `${course.id}-${semester}-${day}-${dayIndex}`,
          title: `${course.id}: ${course.name}`,
          start,
          end,
          resource: {
            courseId: course.id,
            courseName: course.name,
            semester,
            prerequisites: course.prerequisites,
            color,
          },
        };
      });
    });
  }, [courses, startDate]);

  const eventStyleGetter = (event: Event) => {
    const resource = event.resource as EventResource | undefined;
    const color = resource?.color || '#3b82f6';
    
    return {
      style: {
        backgroundColor: color,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  const handleSelectEvent = (event: Event) => {
    const resource = event.resource as EventResource | undefined;
    if (resource) {
      alert(
        `Course: ${resource.courseId}\n` +
        `Name: ${resource.courseName}\n` +
        `Semester: ${resource.semester}\n` +
        `Prerequisites: ${resource.prerequisites.join(', ') || 'None'}`
      );
    }
  };

  return (
    <Card className="w-full my-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full" style={{ height: '600px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            view={currentView}
            onView={setCurrentView}
            date={currentDate}
            onNavigate={setCurrentDate}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
            views={['month', 'week', 'day', 'agenda']}
            defaultView="week"
            step={30}
            timeslots={2}
            style={{ height: '100%' }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
