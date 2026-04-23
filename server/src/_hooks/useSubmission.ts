import { useCallback, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface SubmitFormValues {
  workingHours?: number;
  notes?: string;
  review?: string;
  status?: string;
  technologies?: string[];
}

interface SubmitPayload {
  type: "activity" | "mentorActivity" | "feedback";
  formValues: SubmitFormValues;
  editingEvent?: any;
}

export const useSubmission = (
  role: string,
  studentId: string,
  selectedUser: string,
  date: string,
  editingEvent: any,
  feedbackActivityId: string,
  onSuccess: () => void,
  showToast: (title: string, description: string) => void,
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<any, Error, SubmitPayload>({
    mutationFn: async (payload) => {
      const { type, formValues, editingEvent: evt } = payload;

      let url: string;
      let method: string;
      let body: Record<string, unknown>;

      switch (type) {
        case "activity":
          url = "http://localhost:3000/api/activity";
          method = evt ? "PATCH" : "POST";
          body = {
            studentId,
            date,
            timeSpent: formValues.workingHours,
            notes: formValues.notes,
            technologies: formValues.technologies ?? [],
            ...(evt && { id: evt.id }),
          };
          break;
        case "mentorActivity":
          url = "http://localhost:3000/api/mentor";
          method = evt ? "PATCH" : "POST";
          body = {
            date,
            workingHours: formValues.workingHours,
            activities: formValues.notes,
            ...(evt && { id: evt.id }),
          };
          break;
        case "feedback":
          url = `http://localhost:3000/api/mentorFeedback?activityId=${feedbackActivityId}`;
          method = "POST";
          body = {
            review: formValues.review,
            status: formValues.status,
            mentorId: studentId,
            ...(evt && { id: evt.id }),
          };
          break;
        default:
          throw new Error("Unknown submission type");
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit");
      }

      if (type === "activity" && !evt) {
        try {
          await fetch(
            "http://localhost:3000/api/notifications/activity-submission",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ studentId, taskDate: date }),
            },
          );
        } catch (notificationError) {
          console.error("Error sending notification:", notificationError);
        }
      }

      return res.json();
    },
    onSuccess: (_, payload) => {
      const successMessages = {
        activity: payload.editingEvent ? "Activity Updated" : "Activity Added",
        mentorActivity: payload.editingEvent
          ? "Activity Updated"
          : "Activity Added",
        feedback: payload.editingEvent ? "Feedback Updated" : "Feedback Added",
      };

      const message = successMessages[payload.type];
      showToast(message, `${message} successfully.`);

      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
      queryClient.invalidateQueries({ queryKey: ["eventForDate"] });
      queryClient.invalidateQueries({ queryKey: ["eventFeedback"] });
      queryClient.invalidateQueries({ queryKey: ["mentor-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["mentee-activities"] });
      queryClient.invalidateQueries({ queryKey: ["mentee-feedback-history"] });
      queryClient.invalidateQueries({ queryKey: ["mentee-dashboard"] });
      onSuccess();
    },
    onError: (error) => {
      showToast(
        "Error",
        error.message || "Error saving data. Please try again.",
      );
    },
  });

  const mutateRef = useRef(mutation.mutate);
  mutateRef.current = mutation.mutate;

  const handleSubmit = useCallback(
    (formValues: SubmitFormValues) => {
      const isStudent = role === "student";
      const isMentor = role === "mentor";

      let type: SubmitPayload["type"];
      if (isStudent) {
        type = "activity";
      } else if (isMentor && selectedUser === studentId) {
        type = "mentorActivity";
      } else {
        type = "feedback";
      }

      mutateRef.current({ type, formValues, editingEvent });
    },
    [role, selectedUser, studentId, editingEvent],
  );

  return { handleSubmit, isSubmitting: mutation.isPending };
};
