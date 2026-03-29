import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export const useEventForDate = (
  role: string,
  studentId: string,
  selectedUser: string,
  updateFormData: (
    event: any,
    feedbackData: any,
    formattedDate: string,
  ) => void,
  resetFormData: (formattedDate: string) => void,
) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const buildUrlForRole = (formattedDate: string) => {
    if (role === "student") {
      return `http://localhost:3000/api/activity?date=${formattedDate}`;
    }
    if (studentId === selectedUser) {
      return `http://localhost:3000/api/mentor?date=${formattedDate}&studentId=${selectedUser}`;
    }
    return `http://localhost:3000/api/student?date=${formattedDate}&studentId=${selectedUser}`;
  };

  // Fetch event for selected date using TanStack Query
  const { data: eventData } = useQuery<any>({
    queryKey: ["eventForDate", selectedDate, role, studentId, selectedUser],
    queryFn: async () => {
      if (!selectedDate) return null;

      const url = buildUrlForRole(selectedDate);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch event");
      }

      const data = await response.json();
      return Array.isArray(data) && data.length > 0 ? data[0] : null;
    },
    enabled: !!selectedDate,
    retry: 1,
  });

  // Determine if feedback should be fetched
  const shouldFetchFeedback =
    !!eventData &&
    ((role === "mentor" && studentId !== selectedUser) || role === "student");

  // Fetch feedback if needed using TanStack Query
  const { data: feedbackData } = useQuery<any>({
    queryKey: ["eventFeedback", eventData?.id, selectedDate],
    queryFn: async () => {
      if (!eventData?.id || !selectedDate) return null;

      try {
        const response = await fetch(
          `http://localhost:3000/api/mentorFeedback?date=${selectedDate}&activityId=${eventData.id}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch feedback");
        }

        return await response.json();
      } catch (error) {
        console.error("Error fetching feedback:", error);
        return null;
      }
    },
    enabled: shouldFetchFeedback,
    retry: 1,
  });

  // Update form when event or feedback data changes
  useEffect(() => {
    if (selectedDate) {
      if (eventData) {
        updateFormData(eventData, feedbackData || null, selectedDate);
      } else if (eventData === null) {
        resetFormData(selectedDate);
      }
    }
  }, [eventData, feedbackData, selectedDate, updateFormData, resetFormData]);

  const fetchEventForDate = (formattedDate: string) => {
    setSelectedDate(formattedDate);
  };

  return { fetchEventForDate };
};
