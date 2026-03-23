import { useState } from 'react';

export const useEventForDate = (
  role: string,
  studentId: string,
  selectedUser: string,
  updateFormData: (event: any, feedbackData: any, formattedDate: string) => void,
  resetFormData: (formattedDate: string) => void
) => {
  const fetchEventForDate = async (formattedDate: string) => {
    try {
      const url = buildUrlForRole(formattedDate);
      const response = await fetch(url);
      const data = await response.json();

      if (data.length > 0) {
        await processResponse(data[0], formattedDate);
      } else {
        resetFormData(formattedDate);
      }
    } catch (error) {
      console.error('Failed to fetch event for date:', error);
    }
  };

  const buildUrlForRole = (formattedDate: string) => {
    if (role === 'student') {
      return `http://localhost:3000/api/activity?date=${formattedDate}`;
    }
    if (studentId === selectedUser) {
      return `http://localhost:3000/api/mentor?date=${formattedDate}&studentId=${selectedUser}`;
    }
    return `http://localhost:3000/api/student?date=${formattedDate}&studentId=${selectedUser}`;
  };

  const processResponse = async (existingEvent: any, formattedDate: string) => {
    if ((role === 'mentor' && studentId !== selectedUser) || (role === 'student')) {
      const feedbackData = await fetchFeedback(existingEvent.id, formattedDate);
      updateFormData(existingEvent, feedbackData, formattedDate);
    } else {
      updateFormData(existingEvent, null, formattedDate);
    }
  };

  const fetchFeedback = async (activityId: string, formattedDate: string) => {
    const feedbackResponse = await fetch(
      `http://localhost:3000/api/mentorFeedback?date=${formattedDate}&activityId=${activityId}`
    );
    return await feedbackResponse.json();
  };

  return { fetchEventForDate };
};