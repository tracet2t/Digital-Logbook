"use client";

import { Calendar } from "rsuite";

import "rsuite/dist/rsuite.min.css";

import { useEffect, useMemo, useState } from "react";

import { useCalendarEvents } from "@/_hooks/useCalendarEvents";
import { useEventForDate } from "@/_hooks/useEventForDate";
import { useFormData } from "@/_hooks/useFormData";
import { useSubmission } from "@/_hooks/useSubmission";
import { getSessionOnClient } from "@/server_actions/getSession";
import moment from "moment";

import { eventPropGetter } from "@/lib/calenderUtils";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

import "@/styles/rsuiteCalendar.css";

import MentorStudentTaskDetailDialog from "./mentorStudentTaskDetailDialog";
import MentorTaskDetailDialog from "./mentorTaskDetailDialog";
import StudentTaskDetailDialog from "./studentTaskDetailDialog";

interface FormData {
  studentId: string;
  date: string;
  timeSpent: number;
  notes?: string;
  status?: string;
  review?: string;
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
  technologies?: string[];
  status: "pending" | "approved" | "rejected";
}

interface RsuiteCalendarProps {
  selectedUser?: string;
}

export default function RsuiteCalendar({ selectedUser }: RsuiteCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [session, setSession] = useState(null);
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
    selectedUser ?? "",
  );
  const {
    formData,
    workingHours,
    notes,
    review,
    technologies,
    editingEvent,
    feedbackActivityId,
    updateFormData,
    resetFormData,
  } = useFormData();
  const { fetchEventForDate, loadEventDirectly } = useEventForDate(
    role,
    studentId,
    selectedUser ?? "",
    updateFormData,
    resetFormData,
  );
  const { handleSubmit } = useSubmission(
    role,
    studentId,
    selectedUser ?? "",
    formData.date,
    editingEvent,
    feedbackActivityId,
    () => {
      setTaskModalOpen(false);
      setSelectedDate(undefined);
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

  // Fetch session data
  useEffect(() => {
    setMounted(true);
    setSelectedDate(new Date());
  }, []);

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

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: { [key: string]: CalendarEvent[] } = {};
    events.forEach((event) => {
      const dateKey = moment(event.start).format("YYYY-MM-DD");
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  }, [events]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSelect = (date: Date) => {
    handleDateClick(date);
  };

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

    // Cell click always opens a new task dialog
    resetFormData(formattedDate);
    setTaskModalOpen(true);
  };

  // Load a specific task when clicking its pill
  const handleEventClick = async (event: CalendarEvent, date: Date) => {
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

    // Wait for event data to be loaded before opening the modal,
    // so react-hook-form defaultValues are correct on mount
    await loadEventDirectly(event, formattedDate);
    setTaskModalOpen(true);
  };

  const handleClose = () => {
    setTaskModalOpen(false);
    setSelectedDate(undefined);
  };

  // Custom cell renderer to show events with grid layout
  const renderCell = (date: Date) => {
    const dateKey = moment(date).format("YYYY-MM-DD");
    const dateEvents = eventsByDate[dateKey] || [];

    return (
      <div className="w-full flex flex-col gap-1 pt-1">
        {dateEvents.slice(0, 3).map((event) => {
          const styling = eventPropGetter(event, selectedUser || "");
          return (
            <div
              key={event.id}
              className="text-xs px-2 py-1 rounded font-semibold cursor-pointer hover:opacity-80 truncate"
              style={{
                backgroundColor: styling.style.backgroundColor,
                color: styling.style.color,
              }}
              title={event.title}
              onClick={(e) => {
                e.stopPropagation();
                handleEventClick(event, date);
              }}
            >
              {event.title}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <ToastProvider>
      <div className="flex flex-col p-0 w-full overflow-hidden">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full overflow-hidden">
          {mounted && (
            <Calendar
              value={selectedDate === null ? undefined : selectedDate}
              onChange={handleDateChange}
              onSelect={handleSelect}
              compact={false}
              renderCell={renderCell}
            />
          )}
        </div>

        {/* Task Detail Dialogs - only mount the relevant one */}
        {taskModalOpen && role === "mentor" && selectedUser !== studentId && (
          <MentorTaskDetailDialog
            open={taskModalOpen}
            date={formData.date}
            workingHours={workingHours}
            notes={notes}
            technologies={technologies}
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
            defaultTechStack={technologies}
            review={review}
            isEditable={isEditable}
            onSubmit={(wh, n, techs) => {
              handleSubmit({ workingHours: wh, notes: n, technologies: techs });
            }}
            onClose={handleClose}
          />
        )}

        {/* Toast Component */}
        {toast && (
          <Toast>
            <ToastTitle>{toast.title}</ToastTitle>
            <ToastDescription>{toast.description}</ToastDescription>
            <ToastClose />
          </Toast>
        )}
        <ToastViewport />
      </div>
    </ToastProvider>
  );
}
