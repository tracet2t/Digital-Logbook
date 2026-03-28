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
    status: "pending" | "approved" | "rejected";
}

interface RsuiteCalendarProps {
    selectedUser?: string;
}

export default function RsuiteCalendar({ selectedUser }: RsuiteCalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
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
    const { events, refetchEvents } = useCalendarEvents(studentId, role, selectedUser);
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
    const { fetchEventForDate } = useEventForDate(role, studentId, selectedUser, updateFormData, resetFormData);
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

    const calendarStyles = `
                .rs-calendar-table-cell {
                    border: 1px solid #e2e8f0 !important;
                    vertical-align: top !important;
                }
                .rs-calendar-table-cell-content {
                    height: 90px !important;
                    padding: 4px 6px !important;
                    display: flex !important;
                    flex-direction: column !important;
                }
                .rs-calendar-table-cell-day {
                    font-size: 13px !important;
                    font-weight: 600 !important;
                    color: #374151 !important;
                    align-self: flex-end !important;
                    margin-bottom: 4px !important;
                }
                .rs-calendar-table-header-cell {
                    border: 1px solid #e2e8f0 !important;
                    background-color: #f8fafc !important;
                    font-weight: 700 !important;
                    padding: 8px !important;
                }
                .rs-calendar-table-cell-un-same-month .rs-calendar-table-cell-day {
                    color: #cbd5e1 !important;
                }
                .rs-calendar-table-cell-is-today .rs-calendar-table-cell-day {
                    background-color: #3b82f6 !important;
                    color: white !important;
                    border-radius: 50% !important;
                    width: 24px !important;
                    height: 24px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    align-self: flex-end !important;
                    margin-left: auto !important;
                    margin-right: 0 !important;
                }
                .rs-calendar-table-cell-is-today .rs-calendar-table-cell-content {
                    align-items: flex-end !important;
                }
                .rs-calendar-table-row > .rs-calendar-table-cell:nth-child(6),
                .rs-calendar-table-row > .rs-calendar-table-cell:nth-child(7) {
                    background-color: #fee2e2 !important;
                }
                .rs-calendar-table-header-row > .rs-calendar-table-header-cell:nth-child(6),
                .rs-calendar-table-header-row > .rs-calendar-table-header-cell:nth-child(7) {
                    background-color: #fecaca !important;
                }
                .rs-calendar {
                    width: 100% !important;
                    overflow: hidden !important;
                }
                .rs-calendar-table {
                    width: 100% !important;
                    table-layout: fixed !important;
                }
                .rs-calendar-table-cell,
                .rs-calendar-table-header-cell {
                    width: calc(100% / 7) !important;
                    min-width: 0 !important;
                    overflow: hidden !important;
                }
    `;

    return (
        <ToastProvider>
            <style dangerouslySetInnerHTML={{ __html: calendarStyles }} />
            <div className="flex flex-col p-0 w-full overflow-hidden">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full overflow-hidden">
                    <Calendar
                        value={selectedDate}
                        onChange={handleDateChange}
                        onSelect={handleSelect}
                        fullscreen={true}
                        renderCell={renderCell}
                    />
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
