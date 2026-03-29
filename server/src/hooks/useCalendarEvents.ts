import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  convertToCalendarEvents,
  convertToCalendarEventsMentor,
} from "@/lib/calenderUtils";

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
  status: "pending" | "approved" | "rejected";
}

export const useCalendarEvents = (
  studentId: string,
  role: string,
  selectedUser: string,
) => {
  const queryClient = useQueryClient();

  const buildUrl = () => {
    if (!studentId || !role) return null;

    if (role === "student") {
      return `http://localhost:3000/api/activity?studentId=${studentId}`;
    }

    if (role === "mentor") {
      return studentId === selectedUser
        ? `http://localhost:3000/api/mentor?studentId=${selectedUser}`
        : `http://localhost:3000/api/student?studentId=${selectedUser}`;
    }

    return null;
  };

  const url = buildUrl();

  const {
    data: events = [],
    refetch,
    isLoading,
    error,
  } = useQuery<CalendarEvent[]>({
    queryKey: ["calendarEvents", studentId, role, selectedUser],
    queryFn: async (): Promise<CalendarEvent[]> => {
      if (!url) return [];

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch calendar events");
        }
        const data = await response.json();

        if (!data) return [];

        const parsedEvents =
          role === "mentor"
            ? studentId === selectedUser
              ? convertToCalendarEventsMentor(data)
              : convertToCalendarEvents(data)
            : convertToCalendarEvents(data);

        return parsedEvents;
      } catch (err) {
        console.error("Error fetching calendar events:", err);
        throw err;
      }
    },
    enabled: !!url && !!selectedUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });

  const refetchEvents = async () => {
    await refetch();
  };

  const invalidateCalendarCache = () => {
    queryClient.invalidateQueries({
      queryKey: ["calendarEvents", studentId, role, selectedUser],
    });
  };

  return { events, refetchEvents, invalidateCalendarCache, isLoading, error };
};
