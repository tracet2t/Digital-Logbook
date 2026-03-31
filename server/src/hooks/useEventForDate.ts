import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const buildUrlForRole = (formattedDate: string) => {
    if (role === "student") {
      return `http://localhost:3000/api/activity?date=${formattedDate}`;
    }
    if (studentId === selectedUser) {
      return `http://localhost:3000/api/mentor?date=${formattedDate}&studentId=${selectedUser}`;
    }
    return `http://localhost:3000/api/student?date=${formattedDate}&studentId=${selectedUser}`;
  };

  // Imperative fetch: click date → fetch event + feedback → update form directly.
  // Replaces the previous useState trigger + 2 reactive useQuery + syncing useEffect.
  const fetchEventForDate = useCallback(
    async (formattedDate: string) => {
      // Prevent race condition where role="" causes the wrong API endpoint
      if (!role || !studentId) return;

      try {
        // Fetch event for the date
        const eventData = await queryClient.fetchQuery({
          queryKey: [
            "eventForDate",
            formattedDate,
            role,
            studentId,
            selectedUser,
          ],
          queryFn: async () => {
            const url = buildUrlForRole(formattedDate);
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch event");
            const data = await response.json();
            return Array.isArray(data) && data.length > 0 ? data[0] : null;
          },
          staleTime: 0, // Always fetch fresh data when clicking a date
        });

        if (!eventData) {
          resetFormData(formattedDate);
          return;
        }

        // Fetch feedback if needed (mentor reviewing student, or student viewing own)
        let feedbackData = null;
        const shouldFetchFeedback =
          (role === "mentor" && studentId !== selectedUser) ||
          role === "student";

        if (shouldFetchFeedback && eventData.id) {
          try {
            feedbackData = await queryClient.fetchQuery({
              queryKey: ["eventFeedback", eventData.id, formattedDate],
              queryFn: async () => {
                const response = await fetch(
                  `http://localhost:3000/api/mentorFeedback?date=${formattedDate}&activityId=${eventData.id}`,
                );
                if (!response.ok) throw new Error("Failed to fetch feedback");
                return response.json();
              },
              staleTime: 0,
            });
          } catch (error) {
            console.error("Error fetching feedback:", error);
          }
        }

        updateFormData(eventData, feedbackData, formattedDate);
      } catch (error) {
        console.error("Error fetching event:", error);
        resetFormData(formattedDate);
      }
    },
    [role, studentId, selectedUser, queryClient, updateFormData, resetFormData],
  );

  return { fetchEventForDate };
};
