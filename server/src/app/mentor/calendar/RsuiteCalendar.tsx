"use client";

import { Calendar } from "rsuite";

import "rsuite/dist/rsuite.min.css";

import { useEffect, useMemo, useState } from "react";

import moment from "moment";

import { eventPropGetter } from "@/lib/calenderUtils";
import { useSession } from "@/hooks/core/useSession";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useEventForDate } from "@/hooks/useEventForDate";
import { useFormData } from "@/hooks/useFormData";
import { useSubmission } from "@/hooks/useSubmission";

import "@/styles/rsuiteCalendar.css";

import MentorStudentTaskDetailDialog from "@/components/mentorStudentTaskDetailDialog";
import MentorTaskDetailDialog from "@/components/mentorTaskDetailDialog";
import StudentTaskDetailDialog from "@/components/studentTaskDetailDialog";

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
  status: "pending" | "approved" | "rejected";
}

interface RsuiteCalendarProps {
  selectedUser?: string;
}

export default function RsuiteCalendar({ selectedUser }: RsuiteCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [toast, setToast] = useState<{
    title: string;
    description: string;
  } | null>(null);

  // Shared session hook — cached across all components
  const { data: sessionData } = useSession();

  const studentId = sessionData?.id || "";
  const role = sessionData?.role || "";

  // Custom hooks
  const { events } = useCalendarEvents(studentId, role, selectedUser || "");

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
    selectedUser || "",
    updateFormData,
    resetFormData,
  );

  const { handleSubmit } = useSubmission(
    role,
    studentId,
    selectedUser || "",
    formData.date,
    editingEvent,
    feedbackActivityId,
    () => {
      setTaskModalOpen(false);
      setSelectedDate(null);
      resetFormData("");
    },
    (title, description) => {
      setToast({ title, description });
      setTimeout(() => setToast(null), 3000);
    },
  );

  // Initialize mounted state and selected date on first render
  useEffect(() => {
    setMounted(true);
    setSelectedDate(new Date());
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

  //to open model when date is clicked
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
    setSelectedDate(null);
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
            >
              {event.title}
            </div>
          );
        })}
        {dateEvents.length > 3 && (
          <div className="text-xs px-2 py-1 text-gray-500 font-medium">
            +{dateEvents.length - 3} more
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex h-full min-h-0 flex-col p-0 w-full overflow-hidden">
        <div className="bg-white rounded-lg shadow-lg p-3 md:p-4 w-full h-full min-h-0 overflow-hidden">
          {mounted && (
            <Calendar
              value={selectedDate || new Date()}
              onChange={handleDateChange}
              onSelect={handleSelect}
              compact={false}
              className="h-full"
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

        {/* Toast Component */}
        {toast && (
          <div className="fixed right-4 top-4 z-50 rounded-md border border-slate-300 bg-white px-4 py-3 shadow-lg">
            <p className="text-sm font-semibold text-slate-900">
              {toast.title}
            </p>
            <p className="mt-1 text-sm text-slate-600">{toast.description}</p>
          </div>
        )}
      </div>
    </>
  );
}
