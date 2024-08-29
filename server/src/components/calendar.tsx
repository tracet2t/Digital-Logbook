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
}

const events: CalendarEvent[] = [
  {
    id: 0,
    title: 'Board meeting',
    start: new Date(2024, 7, 29, 9, 0, 0),
    end: new Date(2024, 7, 29, 13, 0, 0),
    color: '#FF5733',
  },
  {
    id: 1,
    title: 'MS training',
    allDay: true,
    start: new Date(2024, 7, 29, 14, 0, 0),
    end: new Date(2024, 7, 29, 16, 30, 0),
    color: '#33FF57',
  },
  {
    id: 2,
    title: 'Team lead meeting',
    start: new Date(2024, 7, 29, 8, 30, 0),
    end: new Date(2024, 7, 29, 12, 30, 0),
    color: '#3357FF',
  },
  {
    id: 11,
    title: 'Birthday Party',
    start: new Date(2024, 7, 30, 7, 0, 0),
    end: new Date(2024, 7, 30, 10, 30, 0),
    color: '#FF33A1',
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
                <h3>{selectedTask.title}</h3>
                <p>
                  Start: {moment(selectedTask.start).format('MMMM Do YYYY, h:mm a')}
                </p>
                <p>
                  End: {moment(selectedTask.end).format('MMMM Do YYYY, h:mm a')}
                </p>
              </div>
            ) : (
              'No task selected'
            )}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleClose}>Close</AlertDialogCancel>
            <AlertDialogAction onClick={handleClose}>OK</AlertDialogAction>
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