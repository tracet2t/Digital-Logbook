import { useState, useEffect } from 'react';
import {
  convertToCalendarEvents,
  convertToCalendarEventsMentor,
} from '@/lib/calenderUtils';

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
  status: 'pending' | 'approved' | 'rejected';
}

export const useCalendarEvents = (studentId: string, role: string, selectedUser: string) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const fetchEventData = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch event data');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const fetchEvents = async () => {
    let url = `http://localhost:3000/api/activity?studentId=${studentId}`;

    if (role === 'mentor') {
      url =
        studentId === selectedUser
          ? `http://localhost:3000/api/mentor?studentId=${selectedUser}`
          : `http://localhost:3000/api/student?studentId=${selectedUser}`;
    }

    const data = await fetchEventData(url);
    if (data) {
      const parsedEvents =
        role === 'mentor'
          ? studentId === selectedUser
            ? convertToCalendarEventsMentor(data)
            : convertToCalendarEvents(data)
          : convertToCalendarEvents(data);
      setEvents(parsedEvents);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchEvents();
    }
  }, [selectedUser, studentId, role]);

  return { events, refetchEvents: fetchEvents };
};