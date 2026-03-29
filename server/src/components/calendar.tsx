"use client";

import React, { useEffect, useState } from "react";

import moment from "moment";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { getSessionOnClient } from "@/server_actions/getSession";

import {
  convertToCalendarEvents,
  convertToCalendarEventsMentor,
  eventPropGetter,
} from "@/lib/calenderUtils";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useEventForDate } from "@/hooks/useEventForDate";
import { useFormData } from "@/hooks/useFormData";
import { useSubmission } from "@/hooks/useSubmission";
// Adjust the import path according to your project structure

import { Button } from "@/components/ui/button";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

import CustomToolbar from "./CustomToolbar";
import MentorStudentTaskDetailDialog from "./mentorStudentTaskDetailDialog";
import MentorTaskDetailDialog from "./mentorTaskDetailDialog";
import StudentTaskDetailDialog from "./studentTaskDetailDialog";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

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
  status: "pending" | "approved" | "rejected"; // New field for status
}

interface TaskCalendarProps {
  selectedUser: string; // New prop for selectedUser
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ selectedUser }) => {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [session, setSession] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [role, setRole] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const [isEditable, setIsEditable] = useState(true);
  const [toast, setToast] = useState<{
    title: string;
    description: string;
  } | null>(null);

  // Custom hooks
  const { events, refetchEvents } = useCalendarEvents(
    studentId,
    role,
    selectedUser,
  );
  const {
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
  } = useFormData();
  const { fetchEventForDate } = useEventForDate(
    role,
    studentId,
    selectedUser,
    updateFormData,
    resetFormData,
  );
  const { handleSubmit } = useSubmission(
    role,
    studentId,
    selectedUser,
    formData,
    workingHours,
    notes,
    review,
    status,
    editingEvent,
    feedbackActivityId,
    () => {
      setTaskModalOpen(false);
      setSelectedDate(null);
      resetFormData("");
      // Delay refetch to avoid rapid re-renders and duplicate submissions
      setTimeout(() => {
        refetchEvents();
      }, 500);
    },
    (title, description) => {
      setToast({ title, description });
      setTimeout(() => setToast(null), 3000);
    },
  );

  useEffect(() => {
    getSessionOnClient()
      .then((data) => {
        setSession(data);
        setStudentId(data.id);
        setRole(data.role);
      })
      .catch((error) => {
        console.error("Error fetching session:", error);
      });
  }, []);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = moment(date).format("YYYY-MM-DD");

    const today = moment().startOf("day");
    const dayBeforeYesterday = moment().subtract(2, "days").startOf("day");

    if (
      moment(date).isSame(today, "day") ||
      moment(date).isBetween(dayBeforeYesterday, today, "day", "[]")
    ) {
      setIsEditable(true);
    } else {
      setIsEditable(false);
    }

    fetchEventForDate(formattedDate);
    setTaskModalOpen(true);
  };

  const handleClose = () => {
    setTaskModalOpen(false);
    setSelectedDate(null);
  };

  useEffect(() => {
    if (status === "approved" || status === "rejected") {
      handleSubmit();
    }
  }, [status]);

  return (
    <>
      <ToastProvider>
        <MentorTaskDetailDialog
          taskModalOpen={taskModalOpen}
          setTaskModalOpen={setTaskModalOpen}
          role={role}
          selectedUser={selectedUser || ""}
          studentId={studentId}
          formData={formData}
          workingHours={workingHours}
          setWorkingHours={setWorkingHours}
          notes={notes}
          setNotes={setNotes}
          /* look down here */
          review={review}
          setReview={setReview}
          setStatus={setStatus}
          handleClose={handleClose}
        />
        <MentorStudentTaskDetailDialog
          taskModalOpen={taskModalOpen}
          setTaskModalOpen={setTaskModalOpen}
          role={role}
          selectedUser={selectedUser || ""}
          studentId={studentId}
          formData={formData}
          workingHours={workingHours}
          setWorkingHours={setWorkingHours}
          notes={notes}
          setNotes={setNotes}
          isEditable={isEditable}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
        />
        <StudentTaskDetailDialog
          taskModalOpen={taskModalOpen}
          setTaskModalOpen={setTaskModalOpen}
          role={role}
          formData={formData}
          workingHours={workingHours}
          setWorkingHours={setWorkingHours}
          notes={notes}
          review={review}
          setNotes={setNotes}
          isEditable={isEditable}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
        />

        <div className="relative w-[90vw] h-[80vh] ">
          <BigCalendar
            events={events}
            localizer={localizer}
            defaultView={Views.MONTH}
            view={Views.MONTH}
            startAccessor="start"
            endAccessor="end"
            onSelectSlot={(slotInfo) => handleDateClick(slotInfo.start)}
            onSelectEvent={(event) => handleDateClick(event.start)}
            selectable
            components={{
              toolbar: (toolbar: any) => (
                <CustomToolbar
                  toolbar={toolbar}
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                />
              ),
            }}
            eventPropGetter={(event) =>
              eventPropGetter(event, selectedUser || "")
            } // Pass selectedUser here
            style={{ height: "100%" }}
          />
        </div>

        {toast && (
          <Toast>
            <ToastTitle>{toast.title}</ToastTitle>
            <ToastDescription>{toast.description}</ToastDescription>
            <ToastClose />
          </Toast>
        )}
        <ToastViewport />
      </ToastProvider>
    </>
  );
};

export default TaskCalendar;
