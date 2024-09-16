"use client";

import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast"; // Adjust the import path according to your project structure

import { Button } from "@/components/ui/button";
import { getSessionOnClient } from "@/server_actions/getSession";
import { convertToCalendarEvents, convertToCalendarEventsMentor, eventPropGetter } from "@/lib/calenderUtils";
import MentorStudentTaskDetailDialog from "./mentorStudentTaskDetailDialog";
import MentorTaskDetailDialog from "./mentorTaskDetailDialog";
import StudentTaskDetailDialog from "./studentTaskDetailDialog";

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

interface TaskCalendarProps {
  selectedUser: string | null; // New prop for selectedUser
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ selectedUser }) => {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [workingHours, setWorkingHours] = useState<number>(0);
  const [session, setSession] = useState(null);
  const [notes, setNotes] = useState<string>("");
  const [review, setReview] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [role, setRole] = useState<string>("");
  const [feedbackActivityId,setFeedbackActivityId] = useState<string>(""); 
  const [formData, setFormData] = useState<FormData>({
    studentId: "",
    date: "",
    timeSpent: 0,
    notes: "",
    status: "",
    review: "",
  });
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [isEditable, setIsEditable] = useState(true);
  const [toast, setToast] = useState<{ title: string; description: string } | null>(null);


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

  /* 

        Fetch all information related to past activities 

  */

  const fetchEventData = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch event data");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const fetchEvents = async () => {
    let url = `http://localhost:3000/api/activity?studentId=${studentId}`;
    
    if (role === 'mentor') {
      url = studentId === selectedUser 
        ? `http://localhost:3000/api/mentor?studentId=${selectedUser}` 
        : `http://localhost:3000/api/student?studentId=${selectedUser}`;
    }
  
    const data = await fetchEventData(url);
    if (data) {
      const parsedEvents =  role === 'mentor' && studentId === selectedUser ? convertToCalendarEventsMentor(data) : convertToCalendarEvents(data);
      setEvents(parsedEvents);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchEvents();
    }
  }, [selectedUser]);


/* 

        Fetch all information related to past activity particularly for a date 

*/

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
    console.error("Failed to fetch event for date:", error);
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
  if (role === 'mentor' && studentId !== selectedUser) {
    const feedbackData = await fetchFeedback(existingEvent.id, formattedDate);
    updateFormData(existingEvent, feedbackData, formattedDate);
  } else {
    updateFormData(existingEvent, null, formattedDate);
  }
};

const fetchFeedback = async (activityId: string, formattedDate: string) => {
  const feedbackResponse = await fetch(`http://localhost:3000/api/mentorFeedback?date=${formattedDate}&activityId=${activityId}`);
  return await feedbackResponse.json();
};

const updateFormData = (event: any, feedbackData: any, formattedDate: string) => {
  setFormData({
    studentId: event.studentId || "",
    date: formattedDate,
    timeSpent: event.timeSpent || event.workingHours || 0,
    notes: event.notes || event.activities || "",
    review: feedbackData?.feedbackNotes || "",
    status: feedbackData?.status || "",
    
  });
  setWorkingHours(event.timeSpent || event.workingHours || 0);
  setNotes(event.notes || event.activities || "");
  setEditingEvent(event);
  setReview(feedbackData?.feedbackNotes || "");
  setFeedbackActivityId(event?.id|| "");
};

const resetFormData = (formattedDate: string) => {
  setFormData({
    studentId: "",
    date: formattedDate,
    timeSpent: 0,
    notes: "",
    review: "",
    status: "",
  });
  setWorkingHours(0);
  setNotes("");
  setEditingEvent(null);
  setReview("");
  setFeedbackActivityId("");
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

  useEffect(() => {
    if (status === "approved") {
      handleSubmit();
    } else if (status === 'rejected') {
      handleSubmit();
    }
  }, [status]);


/* 

        Submit activity or feedback on-press 

*/
  const handleSubmit = async () => {
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
  }
};

const submitActivity = async () => {
  const newFormData: FormData = {
    studentId,
    date: formData.date,
    timeSpent: workingHours,
    notes,
  };

  const response = await fetch("http://localhost:3000/api/activity", {
    method: editingEvent ? "PATCH" : "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...newFormData, id: editingEvent?.id }),
  });

  handleResponse(response, editingEvent ? "Activity Updated" : "Activity Added");
};

const submitMentorActivity = async () => {
  const newFormData: FormData = {
    date: formData.date,
    workingHours,
    activities: notes,
  };

  const response = await fetch("http://localhost:3000/api/mentor", {
    method: editingEvent ? "PATCH" : "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...newFormData, id: editingEvent?.id }),
  });

  handleResponse(response, editingEvent ? "Activity Updated" : "Activity Added");
};

const submitFeedback = async () => {
  const newFormFeedbackData: FormData = {
    review,
    status,
    mentor: studentId,
  };

  const response = await fetch(`http://localhost:3000/api/mentorFeedback?activityId=${feedbackActivityId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...newFormFeedbackData, id: editingEvent?.id }),
  });

  handleResponse(response, editingEvent ? "Feedback Updated" : "Feedback Added");
};

const handleResponse = async (response: Response, successMessage: string) => {
  if (response.ok) {
    showToast(successMessage, response.ok ? `${successMessage} successfully.` : 'An error occurred.');
    fetchEvents();
    handleClose();
  } else {
    showToast('Error', 'Error saving data. Please try again.');
  }
};

const showToast = (title: string, description: string) => {
  setToast({ title, description });
  setTimeout(() => setToast(null), 1000);
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
          onClick={() => {setCurrentDate(moment(currentDate).subtract(1, "months").toDate());goToBack()}}
           className="text-xl border-2 border-blue-500 text-blue-500 px-4 py-2 bg-white rounded-md hover:border-blue-600 hover:bg-blue-100"
          >
          {"<"}
        </Button>
        <span className="text-2xl font-bold">{moment(toolbar.date).format("MMMM YYYY")}</span>
        <Button
          onClick={() => {setCurrentDate(moment(currentDate).subtract(1, "months").toDate());goToNext()}}
         className="text-xl border-2 border-blue-500 text-blue-500 px-4 py-2 bg-#F0F8FF rounded-md hover:border-blue-600 hover:bg-blue-100"
        >
          {">"}
        </Button>
      </div>
    );
  };

  return (

    <>
        <ToastProvider>
        <MentorTaskDetailDialog
        taskModalOpen={taskModalOpen}
        setTaskModalOpen={setTaskModalOpen}
        role={role}
        selectedUser={selectedUser}
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
        selectedUser={selectedUser}
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
            toolbar: CustomToolbar,
          }}
          eventPropGetter={(event) => eventPropGetter(event, selectedUser)} // Pass selectedUser here
          style={{height: "100%"}}
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
