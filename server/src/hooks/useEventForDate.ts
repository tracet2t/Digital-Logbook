import { useMutation } from "@tanstack/react-query";

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
  const buildUrlForRole = (formattedDate: string) => {
    if (role === "student") {
      return `http://localhost:3000/api/activity?date=${formattedDate}`;
    }
    if (studentId === selectedUser) {
      return `http://localhost:3000/api/mentor?date=${formattedDate}&studentId=${selectedUser}`;
    }
    return `http://localhost:3000/api/student?date=${formattedDate}&studentId=${selectedUser}`;
  };

  const mutation = useMutation({
    mutationFn: async (formattedDate: string) => {
      // Fetch event for the date
      const url = buildUrlForRole(formattedDate);
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch event");
      const data = await response.json();
      const eventData = Array.isArray(data) && data.length > 0 ? data[0] : null;

      // Fetch feedback if needed (mentor reviewing student, or student viewing own)
      let feedbackData = null;
      const shouldFetchFeedback =
        (role === "mentor" && studentId !== selectedUser) || role === "student";

      if (shouldFetchFeedback && eventData?.id) {
        try {
          const feedbackResponse = await fetch(
            `http://localhost:3000/api/mentorFeedback?date=${formattedDate}&activityId=${eventData.id}`,
          );
          if (feedbackResponse.ok) {
            feedbackData = await feedbackResponse.json();
          }
        } catch (error) {
          console.error("Error fetching feedback:", error);
        }
      }

      return { eventData, feedbackData, formattedDate };
    },
    onSuccess: ({ eventData, feedbackData, formattedDate }) => {
      if (eventData) {
        updateFormData(eventData, feedbackData, formattedDate);
      } else {
        resetFormData(formattedDate);
      }
    },
    onError: (_error, formattedDate) => {
      console.error("Error fetching event:", _error);
      resetFormData(formattedDate);
    },
  });

  const fetchEventForDate = (formattedDate: string) => {
    // Prevent race condition where role="" causes the wrong API endpoint
    if (!role || !studentId) return;
    mutation.mutate(formattedDate);
  };

  return { fetchEventForDate, isLoading: mutation.isPending };
};
