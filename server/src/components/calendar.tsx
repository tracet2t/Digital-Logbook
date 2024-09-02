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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

const events: CalendarEvent[] = [
  {
    id: 0,
    title: 'Board meeting',
    start: new Date(2024, 7, 29, 9, 0, 0), // August 29, 2024, 9:00 AM
    end: new Date(2024, 7, 29, 13, 0, 0), // August 29, 2024, 1:00 PM
  },
  {
    id: 1,
    title: 'MS training',
    allDay: true,
    start: new Date(2024, 7, 29, 14, 0, 0), // August 29, 2024, 2:00 PM
    end: new Date(2024, 7, 29, 16, 30, 0), // August 29, 2024, 4:30 PM
  },
  {
    id: 2,
    title: 'Team lead meeting',
    start: new Date(2024, 7, 29, 8, 30, 0), // August 29, 2024, 8:30 AM
    end: new Date(2024, 7, 29, 12, 30, 0), // August 29, 2024, 12:30 PM
  },
  {
    id: 11,
    title: 'Birthday Party',
    start: new Date(2024, 7, 30, 7, 0, 0), // August 30, 2024, 7:00 AM
    end: new Date(2024, 7, 30, 10, 30, 0), // August 30, 2024, 10:30 AM
  }
];

const styles = {
  container: {
    width: '80vw',
    height: '60vh',
    margin: '2em'
  }
};

const TaskCalendar: React.FC = () => {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskDetail, setTaskDetail] = useState<{ selectedDate: string }>({ selectedDate: 'No Date Selected' });

  const handleSelectEvent = (event: BigCalendarEvent) => {
    const calendarEvent = event as CalendarEvent; // Type assertion
    setTaskDetail({ selectedDate: calendarEvent.title });
    setTaskModalOpen(true);
  };

  const handleClose = () => {
    setTaskModalOpen(false);
    setSelectedDate(null);
  };

  const handleSubmit = async () => {
    try {
      const newFormData: FormData = {
        studentId,
        date: formData.date,
        timeSpent: workingHours,
        notes,
      };

      const response = await fetch('http://localhost:3000/api/blogs', {
        method: editingEvent ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newFormData,
          id: editingEvent?.id
        }),
      });

      if (response.ok) {
        const updatedEvent: CalendarEvent = await response.json();
        // Refetch events to update the calendar
        const fetchEvents = async () => {
          try {
            const response = await fetch(`http://localhost:3000/api/blogs?studentId=${studentId}`);
            const data = await response.json();
            setEvents(data);
          } catch (error) {
            console.error('Failed to fetch events:', error);
          }
        };

        fetchEvents();
        handleClose();
      } else {
        console.error('Failed to save event:', await response.json());
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  

  const handleNextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, 'months').toDate());
  };

  const handlePrevMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, 'months').toDate());
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

  /*// Filter events based on search query
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
*/
  return (
    <>
      <AlertDialog open={taskModalOpen} onOpenChange={setTaskModalOpen}>
        <AlertDialogTrigger asChild>
          <div />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Task Detail</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <form>
              <div className="mb-4">
                <label>Date</label>
                <Input 
                  type="date"
                  // value={formData.date}
                  disabled
                  className="text-black"
                />
              </div>
              
              <div className="mb-4">
                <label>Working Hours</label>
                <Input
                  type="number"
                  // value={workingHours}
                  onChange={(e) => setWorkingHours(Number(e.target.value) || 0)}
                  placeholder="Enter working hours"
                  // disabled={!isEditable}
                  className="text-black"
                />
              </div>
              <div className="mb-4">
                <label>Notes</label>
                <Textarea 
                  // value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter notes"
                  // disabled={!isEditable}
                  className="text-black"
                />
              </div>
            </form>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleClose}>Close</AlertDialogCancel>
            <AlertDialogAction onClick={handleClose}>OK</AlertDialogAction>
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
          defaultDate={new Date(2024, 7, 29)} // Default to August 29, 2024
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
        />
      </div>
    </>
  );
};

export default TaskCalendar;
