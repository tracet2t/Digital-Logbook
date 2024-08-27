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
];

const styles = {
  container: {
    width: '80vw',
    height: '60vh',
    margin: '2em'
  },
  header: {
    margin: '1em 0',
    textAlign: 'center'
  }
};

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
        <AlertDialogContent className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-semibold text-gray-900">Task Detail</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="text-gray-700">
            <div className="flex gap-6 mb-4">
              <div className="w-1/2">
                <span className="block text-sm font-medium text-black mb-1">Date</span>
                <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
                  <p>{taskDetail.selectedDate}</p>
                </div>
              </div>
              <div className="w-1/2">
                <span className="block text-sm font-medium text-black mb-1">Working Hours</span>
                <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
                  <p>{taskDetail.workingHours}</p>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-black mb-2">Activity</h3>
              <div className="p-3 border border-gray-300 rounded-md bg-gray-50 min-h-[120px] overflow-auto">
                <p>{taskDetail.studentActivity}</p>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-black mb-2">Review</h3>
              <textarea
                value={review}
                onChange={handleReviewChange}
                placeholder="Enter your review here..."
                className="w-full h-32 p-3 border border-gray-300 rounded-md bg-white"
              />
            </div>
          </AlertDialogDescription>
          <AlertDialogFooter className="flex justify-end gap-3 mt-4">
            <AlertDialogCancel onClick={handleClose} className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-md">Close</AlertDialogCancel>
            <AlertDialogAction onClick={handleAccept} className="bg-blue-500 text-white hover:bg-blue-700 px-4 py-2 rounded-md">Accept</AlertDialogAction>
            <AlertDialogAction onClick={handleReject} className="bg-red-500 text-white hover:bg-red-700 px-4 py-2 rounded-md">Reject</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div style={styles.container}>
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
