"use client";

import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer, ToolbarProps } from 'react-big-calendar';
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
    start: new Date(2024, 8, 30, 7, 0, 0),
    end: new Date(2024, 8, 30, 10, 30, 0),
    color: '#FF33A1',
  },

  {
    id: 11,
    title: 'Birthday Party',
    start: new Date(2024, 9, 30, 7, 0, 0),
    end: new Date(2024, 9, 30, 10, 30, 0),
    color: '#FF33A1',
  },
];

const CustomToolbar: React.FC<ToolbarProps> = ({ onNavigate, label }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <Button onClick={() => onNavigate('PREV')}>Previous</Button>
      <span className="text-lg font-semibold">{label}</span>
      <Button onClick={() => onNavigate('NEXT')}>Next</Button>
    </div>
  );
};

const TaskCalendar: React.FC = () => {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    workingHours: '',
    notes: ''
  });
  const [selectedTask, setSelectedTask] = useState<CalendarEvent | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedTask(event);
    setTaskModalOpen(true);
  };

  const handleClose = () => {
    setTaskModalOpen(false);
    setSelectedTask(null);
  };

  const eventPropGetter = (event: CalendarEvent) => {
    return {
      style: {
        backgroundColor: event.color || '#3174ad',
        color: '#fff',
      },
    };
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date; }) => {
    const today = moment().startOf('day');
    const selectedDate = moment(slotInfo.start).startOf('day');
    const twoDaysAgo = moment().subtract(2, 'days').startOf('day');
    
    if (selectedDate.isBefore(twoDaysAgo) || selectedDate.isAfter(today)) {
      setDateError('You cannot add tasks for dates before two days ago or after today.');
      return;
    }

    setFormData({
      date: moment(slotInfo.start).format('YYYY-MM-DD'),
      workingHours: '',
      notes: ''
    });
    setFormOpen(true);
    setDateError(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFormSubmit = async () => {
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: formData.date,
          timeSpent: parseInt(formData.workingHours, 10),
          notes: formData.notes,
        }),
      });

      if (response.ok) {
        console.log('Activity created successfully');
        // Update the calendar with the new activity if needed
      } else {
        console.error('Failed to create activity');
      }
    } catch (error) {
      console.error('Error creating activity:', error);
    }

    setFormOpen(false);
  };

  const handleFormCancel = () => {
    setFormOpen(false);
  };

  const components = {
    toolbar: CustomToolbar,
    month: {
      dateHeader: ({ date, label }: { date: Date; label: string }) => {
        const dayEvents = events.filter((event) =>
          moment(event.start).isSame(date, 'day')
        );

        return (
          <div className="rbc-date-cell p-2">
            {label}
            {dayEvents.length > 0 && (
              <div className="max-h-24 overflow-y-auto mt-2 bg-gray-100 p-2 border border-gray-300 rounded">
                {dayEvents.map((event, idx) => (
                  <div key={idx} className="bg-blue-500 text-white p-1 rounded mb-1">
                    {event.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      },
    },
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[90vw] h-[70vh] my-8">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventPropGetter}
          components={components}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
        />
      </div>
      <AlertDialog open={formOpen} onOpenChange={setFormOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Task Detail</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            {dateError && <p className="text-red-500">{dateError}</p>}
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleFormChange}
              disabled
              className="mb-2"
            />
            <Input
              type="number"
              name="workingHours"
              placeholder="Working Hours"
              value={formData.workingHours}
              onChange={handleFormChange}
              className="mb-2"
            />
            <Textarea
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleFormChange}
              className="mb-2"
            />
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleFormCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleFormSubmit}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={taskModalOpen} onOpenChange={handleClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Task Detail</AlertDialogTitle>
            <AlertDialogDescription>
              <p>Task Title: {selectedTask?.title}</p>
              <p>Start Time: {moment(selectedTask?.start).format('YYYY-MM-DD HH:mm')}</p>
              <p>End Time: {moment(selectedTask?.end).format('YYYY-MM-DD HH:mm')}</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleClose}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TaskCalendar;
