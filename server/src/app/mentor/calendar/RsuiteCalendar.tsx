"use client";

import { Calendar } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { useState, useEffect, useMemo } from "react";
import moment from "moment";
import {
    ToastProvider,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
} from "@/components/ui/toast";

import { getSessionOnClient } from "@/server_actions/getSession";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useFormData } from "@/hooks/useFormData";
import { useSubmission } from "@/hooks/useSubmission";
import { useEventForDate } from "@/hooks/useEventForDate";
import { eventPropGetter } from "@/lib/calenderUtils";
import "@/styles/rsuiteCalendar.css";

import MentorStudentTaskDetailDialog from "@/components/mentorStudentTaskDetailDialog";
import MentorTaskDetailDialog from "@/components/mentorTaskDetailDialog";
import StudentTaskDetailDialog from "@/components/studentTaskDetailDialog";

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
    status: "pending" | "approved" | "rejected";
}

interface RsuiteCalendarProps {
    selectedUser?: string;
}

export default function RsuiteCalendar({ selectedUser }: RsuiteCalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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
    const { events, refetchEvents } = useCalendarEvents(studentId, role, selectedUser || "");
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
    const { fetchEventForDate } = useEventForDate(role, studentId, selectedUser || "", updateFormData, resetFormData);
    const { handleSubmit } = useSubmission(
        role,
        studentId,
        selectedUser || "",
        formData,
        workingHours,
        notes,
        review,
        status,
        editingEvent,
        feedbackActivityId,
        () => {
            refetchEvents();
            setTaskModalOpen(false);
            setSelectedDate(null);
        },
        (title, description) => {
            setToast({ title, description });
            setTimeout(() => setToast(null), 1000);
        }
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

        if (moment(date).isSame(today, "day") || moment(date).isBetween(dayBeforeYesterday, today, "day", "[]")) {
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
        <ToastProvider>
            <div className="flex flex-col p-0 w-full overflow-hidden">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full overflow-hidden">
                    {mounted && (
                        <Calendar
                            value={selectedDate || new Date()}
                            onChange={handleDateChange}
                            onSelect={handleSelect}
                            fullscreen={true}
                            renderCell={renderCell}
                        />
                    )}
                </div>
                {selectedDate && (
                    <p className="mt-2 text-sm font-semibold text-gray-700">
                        Selected: {selectedDate.toDateString()}
                    </p>
                )}

                {/* Task Detail Dialogs */}
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
