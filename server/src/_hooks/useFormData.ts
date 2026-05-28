import { useCallback, useState } from "react";

interface FormData {
  studentId: string;
  date: string;
  timeSpent: number;
  notes?: string;
  status?: string;
  review?: string;
  technologies?: string[];
}

export const useFormData = () => {
  const [formData, setFormData] = useState<FormData>({
    studentId: "",
    date: "",
    timeSpent: 0,
    notes: "",
    status: "",
    review: "",
    technologies: [],
  });
  const [workingHours, setWorkingHours] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [review, setReview] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [feedbackActivityId, setFeedbackActivityId] = useState<string>("");

  const updateFormData = useCallback(
    (event: any, feedbackData: any, formattedDate: string) => {
      setFormData({
        studentId: event.studentId || "",
        date: formattedDate,
        timeSpent: event.timeSpent || event.workingHours || 0,
        notes: event.notes || event.activities || "",
        review: feedbackData?.feedbackNotes || "",
        status: feedbackData?.status || "",
        technologies: event.technologies || [],
      });
      setWorkingHours(event.timeSpent || event.workingHours || 0);
      setNotes(event.notes || event.activities || "");
      setTechnologies(event.technologies || []);
      setEditingEvent(event);
      setReview(feedbackData?.feedbackNotes || "");
      setFeedbackActivityId(event?.id || "");
    },
    [],
  );

  const resetFormData = useCallback((formattedDate: string) => {
    setFormData({
      studentId: "",
      date: formattedDate,
      timeSpent: 0,
      notes: "",
      review: "",
      status: "",
      technologies: [],
    });
    setWorkingHours(2);
    setNotes("");
    setTechnologies([]);
    setEditingEvent(null);
    setReview("");
    setFeedbackActivityId("");
  }, []);

  return {
    formData,
    workingHours,
    setWorkingHours,
    notes,
    setNotes,
    review,
    setReview,
    status,
    setStatus,
    technologies,
    setTechnologies,
    editingEvent,
    feedbackActivityId,
    updateFormData,
    resetFormData,
  };
};
