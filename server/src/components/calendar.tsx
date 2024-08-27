'use client';

import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views, Event as BigCalendarEvent } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  feedback?: string;
  studentId?: number;
}

const events: CalendarEvent[] = [
  {
    id: 0,
    title: 'Board meeting',
    start: new Date(2024, 7, 29, 9, 0, 0),
    end: new Date(2024, 7, 29, 13, 0, 0),
    studentId: 123,
    feedback: '',
  },
  {
    id: 1,
    title: 'MS training',
    allDay: true,
    start: new Date(2024, 7, 29, 14, 0, 0),
    end: new Date(2024, 7, 29, 16, 30, 0),
    studentId: 124,
    feedback: '',
  },
  // Add other events as needed
];

const TaskCalendar: React.FC = () => {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskDetail, setTaskDetail] = useState<{ selectedDate: string; workingHours: string; studentActivity: string; review: string }>({
    selectedDate: '',
    workingHours: '',
    studentActivity: '',
    review: '',
  });
  const [review, setReview] = useState<string>('');
  const [currentStudentId, setCurrentStudentId] = useState<number | null>(null);

  const handleSelectEvent = (event: BigCalendarEvent) => {
    const calendarEvent = event as CalendarEvent;
    setTaskDetail({
      selectedDate: moment(calendarEvent.start).format('MMMM D, YYYY'),
      workingHours: '8:00 AM - 5:00 PM',
      studentActivity: calendarEvent.title,
      review: calendarEvent.feedback || '',
    });
    setReview(calendarEvent.feedback || '');
    setCurrentStudentId(calendarEvent.studentId || null);
    setTaskModalOpen(true);
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
  };

  const handleAccept = () => {
    console.log("Task Accepted");
    // Implement further logic here, e.g., update task status, send feedback
    setTaskModalOpen(false);
  };

  const handleReject = () => {
    console.log("Task Rejected");
    // Implement further logic here, e.g., update task status, send feedback
    setTaskModalOpen(false);
  };

  const handleClose = () => {
    setTaskModalOpen(false);
  };

  return (
    <>
      {/* Task Detail Modal */}
      <AlertDialog open={taskModalOpen} onOpenChange={setTaskModalOpen}>
        <AlertDialogTrigger asChild>
          <div />
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-2xl mx-auto p-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Task Detail for {taskDetail.selectedDate}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <div className="flex justify-between mb-4">
              <span>Date: {taskDetail.selectedDate}</span>
              <span>Working Hours: {taskDetail.workingHours}</span>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Activity</h3>
              <p>{taskDetail.studentActivity}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Review</h3>
              <textarea
                value={review}
                onChange={handleReviewChange}
                placeholder="Enter your review here..."
                className="w-full h-24 p-2 border rounded-md"
              />
            </div>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleClose} className="bg-green-500 text-white hover:bg-green-600">Close</AlertDialogCancel>
            <AlertDialogAction onClick={handleAccept} className="bg-blue-500 text-white hover:bg-blue-600">
              Accept
            </AlertDialogAction>
            <AlertDialogAction onClick={handleReject} className="bg-red-500 text-white hover:bg-red-600">
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="w-4/5 h-3/5 mx-auto my-4">
        <BigCalendar
          selectable
          localizer={localizer}
          events={events}
          defaultView={Views.WEEK}
          views={[Views.DAY, Views.WEEK, Views.MONTH]}
          step={60}
          defaultDate={new Date(2024, 7, 29)}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
        />
      </div>
    </>
  );
};

export default TaskCalendar;
