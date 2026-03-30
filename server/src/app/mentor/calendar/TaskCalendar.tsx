"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import moment from "moment";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { getSessionOnClient } from "@/server_actions/getSession";

import { eventPropGetter } from "@/lib/calenderUtils";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useEventForDate } from "@/hooks/useEventForDate";
import { useFormData } from "@/hooks/useFormData";
import { useSubmission } from "@/hooks/useSubmission";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import CustomToolbar from "@/components/CustomToolbar";
import MentorStudentTaskDetailDialog from "@/components/mentorStudentTaskDetailDialog";
import MentorTaskDetailDialog from "@/components/mentorTaskDetailDialog";
import StudentTaskDetailDialog from "@/components/studentTaskDetailDialog";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

interface SessionData {
  id: string;
  role: string;
  fname: string;
  lname: string;
  email: string;
}

// Unused interface - declared for reference only
// interface FormData {
//   studentId: string;
//   date: string;
//   timeSpent: number;
//   notes?: string;
//   status?: string;
//   review?: string;
// }

// Unused interface - declared for reference only
// interface FeedbackData {
//   review: string;
//   status: string;
//   mentorId: string;
// }

// Unused interface - declared for reference only
// interface MentorFormData {
//   date: string;
//   workingHours: number;
//   activities: string;
// }

// Unused interface - declared for reference only
// interface CalendarEvent {
//   id: string;
//   title: string;
//   start: Date;
//   end: Date;
//   allDay?: boolean;
//   color?: string;
//   createdAt: Date;
//   studentId: string;
//   timeSpent?: number;
//   notes?: string;
//   status: "pending" | "approved" | "rejected";
// }

interface TaskCalendarProps {
  selectedUser: string;
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ selectedUser }) => {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isEditable, setIsEditable] = useState(true);
  const [toast, setToast] = useState<{
    title: string;
    description: string;
  } | null>(null);

  // Fetch session data using TanStack Query
  const { data: sessionData } = useQuery<SessionData>({
    queryKey: ["session"],
    queryFn: async () => {
      const data = await getSessionOnClient();
      if (!data) throw new Error("Failed to fetch session");
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
    retry: 1,
  });

  const studentId = sessionData?.id || "";
  const role = sessionData?.role || "";

  // Custom hooks
  const { events, refetchEvents } = useCalendarEvents(
    studentId,
    role,
    selectedUser,
  );
  const {
    formData,
    workingHours,
    notes,
    review,
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
    formData.date,
    editingEvent,
    feedbackActivityId,
    () => {
      setTaskModalOpen(false);
      resetFormData("");
      setTimeout(() => {
        refetchEvents();
      }, 500);
    },
    (title, description) => {
      setToast({ title, description });
      setTimeout(() => setToast(null), 3000);
    },
  );

  const handleDateClick = (date: Date) => {
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
  };

  return (
    <>
      <ToastProvider>
        {taskModalOpen && role === "mentor" && selectedUser !== studentId && (
          <MentorTaskDetailDialog
            open={taskModalOpen}
            date={formData.date}
            workingHours={workingHours}
            notes={notes}
            onSubmit={(reviewText, status) => {
              handleSubmit({ review: reviewText, status });
            }}
            onClose={handleClose}
          />
        )}
        {taskModalOpen && role === "mentor" && selectedUser === studentId && (
          <MentorStudentTaskDetailDialog
            open={taskModalOpen}
            date={formData.date}
            defaultWorkingHours={workingHours}
            defaultNotes={notes}
            isEditable={isEditable}
            onSubmit={(wh, n) => {
              handleSubmit({ workingHours: wh, notes: n });
            }}
            onClose={handleClose}
          />
        )}
        {taskModalOpen && role === "student" && (
          <StudentTaskDetailDialog
            open={taskModalOpen}
            date={formData.date}
            defaultWorkingHours={workingHours}
            defaultNotes={notes}
            review={review}
            isEditable={isEditable}
            onSubmit={(wh, n) => {
              handleSubmit({ workingHours: wh, notes: n });
            }}
            onClose={handleClose}
          />
        )}

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
