import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface FormData {
  studentId: string;
  date: string;
  timeSpent: number;
  notes?: string;
  status?: string;
  review?: string;
}

interface FeedbackData {
  review: string;
  status: string;
  mentorId: string;
}

interface MentorFormData {
  date: string;
  workingHours: number;
  activities: string;
}

interface SubmitPayload {
  type: "activity" | "mentorActivity" | "feedback";
  data: any;
  editingEvent?: any;
}

export const useSubmission = (
  role: string,
  studentId: string,
  selectedUser: string,
  formData: FormData,
  workingHours: number,
  notes: string,
  review: string,
  status: string,
  editingEvent: any,
  feedbackActivityId: string,
  onSuccess: () => void,
  showToast: (title: string, description: string) => void,
) => {
  const queryClient = useQueryClient();

  const submitActivity = async (payload: SubmitPayload) => {
    const newFormData: FormData = {
      studentId,
      date: formData.date,
      timeSpent: workingHours,
      notes,
    };

    const res = await fetch("http://localhost:3000/api/activity", {
      method: payload.editingEvent ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newFormData, id: payload.editingEvent?.id }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to submit activity");
    }

    // Send notification for new activities
    if (!payload.editingEvent) {
      try {
        await fetch(
          "http://localhost:3000/api/notifications/activity-submission",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              studentId,
              taskDate: formData.date,
            }),
          },
        );
      } catch (notificationError) {
        console.error("Error sending notification:", notificationError);
      }
    }

    return res.json();
  };

  const submitMentorActivity = async (payload: SubmitPayload) => {
    const newFormData: MentorFormData = {
      date: formData.date,
      workingHours: workingHours,
      activities: notes,
    };

    const res = await fetch("http://localhost:3000/api/mentor", {
      method: payload.editingEvent ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newFormData, id: payload.editingEvent?.id }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to submit mentor activity");
    }

    return res.json();
  };

  const submitFeedback = async (payload: SubmitPayload) => {
    const newFormFeedbackData: FeedbackData = {
      review,
      status,
      mentorId: studentId,
    };

    const res = await fetch(
      `http://localhost:3000/api/mentorFeedback?activityId=${feedbackActivityId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newFormFeedbackData,
          id: payload.editingEvent?.id,
        }),
      },
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to submit feedback");
    }

    return res.json();
  };

  const mutation = useMutation<any, Error, SubmitPayload>({
    mutationFn: async (payload) => {
      switch (payload.type) {
        case "activity":
          return submitActivity(payload);
        case "mentorActivity":
          return submitMentorActivity(payload);
        case "feedback":
          return submitFeedback(payload);
        default:
          throw new Error("Unknown submission type");
      }
    },
    onSuccess: (_, payload) => {
      const successMessages = {
        activity: editingEvent ? "Activity Updated" : "Activity Added",
        mentorActivity: editingEvent ? "Activity Updated" : "Activity Added",
        feedback: editingEvent ? "Feedback Updated" : "Feedback Added",
      };

      const message =
        successMessages[payload.type as keyof typeof successMessages];
      showToast(message, `${message} successfully.`);

      // Invalidate calendar events cache
      queryClient.invalidateQueries({
        queryKey: ["calendarEvents"],
      });

      onSuccess();
    },
    onError: (error) => {
      showToast(
        "Error",
        error.message || "Error saving data. Please try again.",
      );
    },
  });

  const handleSubmit = useCallback(async () => {
    const isStudent = role === "student";
    const isMentor = role === "mentor";

    if (isStudent) {
      mutation.mutate({
        type: "activity",
        data: formData,
        editingEvent,
      });
    } else if (isMentor && selectedUser === studentId) {
      mutation.mutate({
        type: "mentorActivity",
        data: formData,
        editingEvent,
      });
    } else {
      mutation.mutate({
        type: "feedback",
        data: formData,
        editingEvent,
      });
    }
  }, [role, selectedUser, studentId, formData, editingEvent, mutation]);

  return { handleSubmit, isSubmitting: mutation.isPending };
};
