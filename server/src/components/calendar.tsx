"use client";

import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getSessionOnClient } from "@/server_actions/getSession";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

interface FormData {
  studentId: string;
  date: string;
  timeSpent: number;
  notes: string;
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

const convertToCalendarEvents = (data: any[]): CalendarEvent[] => {
  return data.map((item, index) => {
    const startDate = new Date(item.date);
    const endDate = new Date(item.date); // Calculate end time
    console.log(item.feedback[0]?.status);

    return {
      id: index,
      title: item.notes || "No Title",
      start: startDate,
      end: endDate,
      status: item.feedback[0]?.status, // Add the status field
    };
  });
};

const TaskCalendar: React.FC = () => {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [workingHours, setWorkingHours] = useState<number>(0);
  const [session, setSession] = useState(null);
  const [notes, setNotes] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formData, setFormData] = useState<FormData>({
    studentId: "",
    date: "",
    timeSpent: 0,
    notes: "",
  });
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [isEditable, setIsEditable] = useState(true);

  useEffect(() => {
    getSessionOnClient()
      .then((data) => {
        setSession(data);
        setStudentId(data.id);
      })
      .catch((error) => {
        console.error("Error fetching session:", error);
      });
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/blogs?studentId=${studentId}`);
      const data = await response.json();
      const parsedEvents = convertToCalendarEvents(data);
      setEvents(parsedEvents);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchEvents();
    }
  }, [studentId]);

  const fetchEventForDate = async (formattedDate: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/blogs?date=${formattedDate}&studentId=${studentId}`);
      const data = await response.json();
      if (data.length > 0) {
        const existingEvent = data[0];
        setFormData({
          studentId: existingEvent.studentId || "",
          date: formattedDate,
          timeSpent: existingEvent.timeSpent || 0,
          notes: existingEvent.notes || "",
        });
        setWorkingHours(existingEvent.timeSpent || 0);
        setNotes(existingEvent.notes || "");
        setEditingEvent(existingEvent);
      } else {
        setFormData({
          studentId: "",
          date: formattedDate,
          timeSpent: 0,
          notes: "",
        });
        setWorkingHours(0);
        setNotes("");
        setEditingEvent(null);
      }
    } catch (error) {
      console.error("Failed to fetch event for date:", error);
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = moment(date).format("YYYY-MM-DD");

    const today = moment().startOf("day");
    const dayBeforeYesterday = moment().subtract(2, "days").startOf("day");

    if (moment(date).isBefore(dayBeforeYesterday) || moment(date).isAfter(today)) {
      setIsEditable(false);
    } else {
      setIsEditable(true);
    }

    fetchEventForDate(formattedDate);
    setTaskModalOpen(true);
  };

  const handleClose = () => {
    setTaskModalOpen(false);
    setSelectedDate(null);
  };

  const handleSubmit = async () => {
    try {
      const newFormData: FormData = {
        studentId,
        date: formData.date,
        timeSpent: workingHours,
        notes,
      };

      const response = await fetch("http://localhost:3000/api/blogs", {
        method: editingEvent ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newFormData,
          id: editingEvent?.id,
        }),
      });

      if (response.ok) {
        // Update events without refreshing
        fetchEvents();
        handleClose();
      } else {
        console.error("Failed to save event:", await response.json());
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Custom Toolbar
  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
      toolbar.onNavigate("PREV");
    };

    const goToNext = () => {
      toolbar.onNavigate("NEXT");
    };

    return (
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() => setCurrentDate(moment(currentDate).subtract(1, "months").toDate())}
          className="text-xl"
        >
          {"<"}
        </Button>
        <span className="text-2xl font-bold">{moment(toolbar.date).format("MMMM YYYY")}</span>
        <Button
          onClick={() => setCurrentDate(moment(currentDate).add(1, "months").toDate())}
          className="text-xl"
        >
          {">"}
        </Button>
      </div>
    );
  };

  // Event Prop Getter to set custom styles
  const eventPropGetter = (event: CalendarEvent) => {
    let backgroundColor = "#ffff00"; // Default background color
    let textColor = "#000000"; // Default text color (white)
    console.log(event);
  
    // Customize based on event status
    if (event.status === "pending") {
      backgroundColor = "#ffff00"; // Yellow background for pending
      textColor = "#000000"; // Black text for better contrast
    } else if (event.status === "approved") {
      backgroundColor = "#008000"; // Green background for accepted
      textColor = "#ffffff"; // White text for contrast
    } else if (event.status === "rejected") {
      backgroundColor = "#ff0000"; // Red background for rejected
      textColor = "#ffffff"; // White text for contrast
    }
  
    return {
      style: {
        backgroundColor,
        color: textColor, // Apply text color based on status
      },
    };
  };

  return (
    <>
      <AlertDialog open={taskModalOpen} onOpenChange={setTaskModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Task Details</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <form>
              <div className="mb-4">
                <label>Date</label>
                <Input type="date" value={formData.date} disabled className="text-black" />
              </div>

              <div className="mb-4">
                <label>Working Hours</label>
                <Input
                  type="number"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(Number(e.target.value) || 0)}
                  placeholder="Enter working hours"
                  disabled={!isEditable}
                  className="text-black"
                />
              </div>
              <div className="mb-4">
                <label>Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter notes"
                  disabled={!isEditable}
                  className="text-black"
                />
              </div>
            </form>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
            {isEditable && <AlertDialogAction onClick={handleSubmit}>Save</AlertDialogAction>}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="relative w-[80vw] h-[60vh]">
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
            toolbar: CustomToolbar,
          }}
          eventPropGetter={eventPropGetter} // Apply custom styles based on event status
          style={{ height: "100%" }}
        />
      </div>
    </>
  );
};

export default TaskCalendar;
