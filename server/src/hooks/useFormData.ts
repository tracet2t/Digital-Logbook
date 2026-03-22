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

export const useFormData = () => {
  const [formData, setFormData] = useState<FormData>({
    studentId: '',
    date: '',
    timeSpent: 0,
    notes: '',
    status: '',
    review: '',
  });
  const [workingHours, setWorkingHours] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [review, setReview] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [feedbackActivityId, setFeedbackActivityId] = useState<string>('');

  const updateFormData = (
    event: any,
    feedbackData: any,
    formattedDate: string
  ) => {
    setFormData({
      studentId: event.studentId || '',
      date: formattedDate,
      timeSpent: event.timeSpent || event.workingHours || 0,
      notes: event.notes || event.activities || '',
      review: feedbackData?.feedbackNotes || '',
      status: feedbackData?.status || '',
    });
    setWorkingHours(event.timeSpent || event.workingHours || 0);
    setNotes(event.notes || event.activities || '');
    setEditingEvent(event);
    setReview(feedbackData?.feedbackNotes || '');
    setFeedbackActivityId(event?.id || '');
  };

  const resetFormData = (formattedDate: string) => {
    setFormData({
      studentId: '',
      date: formattedDate,
      timeSpent: 0,
      notes: '',
      review: '',
      status: '',
    });
    setWorkingHours(1);
    setNotes('');
    setEditingEvent(null);
    setReview('');
    setFeedbackActivityId('');
  };

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
    editingEvent,
    feedbackActivityId,
    updateFormData,
    resetFormData,
  };
};