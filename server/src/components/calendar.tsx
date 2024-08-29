"use client";

import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
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
  color?: string;
  comments?: string;  // Comments or feedback field
}

const events: CalendarEvent[] = [
  {
    id: 0,
    title: 'Board meeting',
    start: new Date(2024, 7, 29, 9, 0, 0),
    end: new Date(2024, 7, 29, 13, 0, 0),
    color: '#FDC70A',
  },
  {
    id: 1,
    title: 'MS training',
    allDay: true,
    start: new Date(2024, 7, 29, 14, 0, 0),
    end: new Date(2024, 7, 29, 16, 30, 0),
    color: '#297D3B',
    comments: 'Mandatory for all employees',  // Dummy comment
  },
  {
    id: 2,
    title: 'Team lead meeting',
    start: new Date(2024, 7, 29, 8, 30, 0),
    end: new Date(2024, 7, 29, 12, 30, 0),
    color: '#C80505',
    comments: 'Discuss project updates',  // Dummy comment
  },
  {
    id: 11,
    title: 'Birthday Party',
    start: new Date(2024, 7, 30, 7, 0, 0),
    end: new Date(2024, 7, 30, 10, 30, 0),
    color: '#C80505',
    comments: 'Team building event',  // Dummy comment
  },
];

const TaskCalendar: React.FC = () => {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<CalendarEvent | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date(2024, 7, 29));

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedTask(event);
    setTaskModalOpen(true);
  };

  const handleClose = () => {
    setTaskModalOpen(false);
    setSelectedTask(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, 'months').toDate());
  };

  const handlePrevMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, 'months').toDate());
  };

  const eventPropGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color || '#3174ad',
        color: '#fff',
      },
    };
  };

  const components = {
    month: {
      dateHeader: ({ date, label }: { date: Date; label: string }) => {
        const dayEvents = events.filter((event) =>
          moment(event.start).isSame(date, 'day')
        );

        return (
          <div className="rbc-date-cell" style={{ padding: '5px' }}>
            <span>{label}</span>
            <div
              style={{
                maxHeight: '80px',
                overflowY: 'auto',
                marginTop: '5px',
              }}
            >
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="rbc-event"
                  style={{
                    backgroundColor: event.color,
                    padding: '2px',
                    margin: '2px 0',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSelectEvent(event)}
                >
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        );
      },
    },
  };

  const calculateDuration = (start: Date, end: Date) => {
    const duration = moment.duration(moment(end).diff(moment(start)));
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    return `${hours}h ${minutes}m`;
  };

  return (
    <>
      <AlertDialog open={taskModalOpen} onOpenChange={setTaskModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Task Detail</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            {selectedTask ? (
              <div>
                <div className="mb-4">
                  <label className="block font-semibold">Activity:</label>
                  <input
                    type="text"
                    value={selectedTask.title}
                    readOnly
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold">Working Hours:</label>
                  <input
                    type="text"
                    value={calculateDuration(selectedTask.start, selectedTask.end)}
                    readOnly
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold">Mentor Comments:</label>
                  <textarea
                    value={selectedTask.comments || ''}
                    readOnly
                    rows={3}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            ) : (
              'No task selected'
            )}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleClose}
              className="bg-[#007BFF] text-white hover:bg-[#0056b3] focus:ring-[#0056b3]"
            >
              Close
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClose}
              className="bg-[#28A745] text-white hover:bg-[#218838] focus:ring-[#218838]"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="relative w-[80vw] h-[60vh] my-8 mx-auto">
        <div className="mb-5 flex justify-between items-center">
          <Button onClick={handlePrevMonth} className="p-8">
            Previous
          </Button>
          <Button onClick={handleNextMonth} className="p-8">
            Next
          </Button>
        </div>
        <BigCalendar
          selectable
          localizer={localizer}
          events={events}
          defaultView={Views.MONTH}
          views={[Views.MONTH]}
          date={currentDate}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
          className="mt-5"
          toolbar={false}
          eventPropGetter={eventPropGetter}
          components={components}
        />
      </div>
    </>
  );
};

export default TaskCalendar;
