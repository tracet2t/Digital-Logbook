"use client";

import React, { useState, useEffect } from 'react';
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
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";


moment.locale('en-GB');
const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  createdAt: Date;
  studentId: string;
  timeSpent?: number;
  notes?: string;
}

interface FormData {
  studentId: string;
  date: string;
  timeSpent: number;
  notes: string;
}

const TaskCalendar: React.FC = () => {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [workingHours, setWorkingHours] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formData, setFormData] = useState<FormData>({
    studentId: '',
    date: '',
    timeSpent: 0,
    notes: '',
  });
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [isEditable, setIsEditable] = useState(true);

  useEffect(() => {
    // Fetch the logged-in user's student ID
    const fetchStudentId = async () => {
      try {
        const response = await fetch('/api/auth/user'); // user API route
        const data = await response.json();
        setStudentId(data.studentId); // Assuming the API response has a `studentId` field
      } catch (error) {
        console.error('Failed to fetch student ID:', error);
      }
    };

    fetchStudentId();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/blogs?studentId=${studentId}`);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    if (studentId) {
      fetchEvents();
    }
  }, [studentId]);

  const fetchEventForDate = async (formattedDate: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/blogs?date=${formattedDate}&studentId=${studentId}`);
      const data = await response.json();
      if (data.length > 0) {
        const existingEvent = data[0];
        setFormData({
          studentId: existingEvent.studentId || '',
          date: formattedDate,
          timeSpent: existingEvent.timeSpent || 0,
          notes: existingEvent.notes || '',
        });
        setWorkingHours(existingEvent.timeSpent || 0);
        setNotes(existingEvent.notes || '');
        setEditingEvent(existingEvent);
      } else {
        setFormData({
          studentId: '',
          date: formattedDate,
          timeSpent: 0,
          notes: '',
        });
        setWorkingHours(0);
        setNotes('');
        setEditingEvent(null);
      }
    } catch (error) {
      console.error('Failed to fetch event for date:', error);
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = moment(date).format('YYYY-MM-DD');

    const dayBeforeYesterday = moment().subtract(2, 'days').startOf('day');
    if (moment(date).isBefore(dayBeforeYesterday)) {
      setIsEditable(false);
    } else {
      setIsEditable(true);
    }

    fetchEventForDate(formattedDate);
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

  const eventPropGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color || '#3174ad',
        color: '#fff',
      },
    };
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

  // Filter events based on search query
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AlertDialog open={taskModalOpen} onOpenChange={setTaskModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Task Details</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <form>
              <div className="mb-4">
                <label>Date</label>
                <Input 
                  type="date"
                  value={formData.date}
                  disabled
                  className="text-black"
                />
              </div>
              
              <div className="mb-4">
                <label>Working Hours</label>
                <Input
                  type="number"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(Number(e.target.value) || 0)}
                  placeholder="Enter working hours"
                  disabled={!isEditable}
                  className="text-black"
                />
              </div>
              <div className="mb-4">
                <label>Notes</label>
                <Textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter notes"
                  disabled={!isEditable}
                  className="text-black"
                />
              </div>
            </form>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
            {isEditable && <AlertDialogAction onClick={handleSubmit}>Save</AlertDialogAction>}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="relative w-[80vw] h-[60vh] my-8 mx-auto">
        <div className="mb-5 flex justify-between items-center">
          <Button onClick={() => setCurrentDate(moment(currentDate).subtract(1, 'months').toDate())}>
            Previous
          </Button>
          <Button onClick={() => setCurrentDate(moment(currentDate).add(1, 'months').toDate())}>
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
          onSelectSlot={(slotInfo) => handleDateClick(slotInfo.start)}
          eventPropGetter={eventPropGetter}
        />
      </div>
    </>
  );
};

export default TaskCalendar;
