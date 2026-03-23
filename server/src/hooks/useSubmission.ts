import { useState } from 'react';

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
  showToast: (title: string, description: string) => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const isStudent = role === 'student';
      const isMentor = role === 'mentor';

      if (isStudent) {
        await submitActivity();
      } else if (isMentor && selectedUser === studentId) {
        await submitMentorActivity();
      } else {
        await submitFeedback();
      }
    } catch (error) {
      showToast('Error', 'Error saving data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitActivity = async () => {
    const newFormData: FormData = {
      studentId,
      date: formData.date,
      timeSpent: workingHours,
      notes,
    };

    const response = await fetch('http://localhost:3000/api/activity', {
      method: editingEvent ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...newFormData, id: editingEvent?.id }),
    });

    handleResponse(
      response,
      editingEvent ? 'Activity Updated' : 'Activity Added'
    );
  };

  const submitMentorActivity = async () => {
    const newFormData: MentorFormData = {
      date: formData.date,
      workingHours: workingHours,
      activities: notes,
    };

    const response = await fetch('http://localhost:3000/api/mentor', {
      method: editingEvent ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...newFormData, id: editingEvent?.id }),
    });

    handleResponse(
      response,
      editingEvent ? 'Activity Updated' : 'Activity Added'
    );
  };

  const submitFeedback = async () => {
    const newFormFeedbackData: FeedbackData = {
      review,
      status,
      mentorId: studentId,
    };

    const response = await fetch(
      `http://localhost:3000/api/mentorFeedback?activityId=${feedbackActivityId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newFormFeedbackData, id: editingEvent?.id }),
      }
    );

    handleResponse(
      response,
      editingEvent ? 'Feedback Updated' : 'Feedback Added'
    );
  };

  const handleResponse = async (response: Response, successMessage: string) => {
    if (response.ok) {
      showToast(
        successMessage,
        response.ok ? `${successMessage} successfully.` : 'An error occurred.'
      );
      onSuccess();
    } else {
      showToast('Error', 'Error saving data. Please try again.');
    }
  };

  return { handleSubmit, isSubmitting };
};