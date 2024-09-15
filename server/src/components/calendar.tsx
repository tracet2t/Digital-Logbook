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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast"; // Adjust the import path according to your project structure

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getSessionOnClient } from "@/server_actions/getSession";
import { convertToCalendarEvents, convertToCalendarEventsMentor } from "@/lib/eventConverters";

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
      const parsedEvents = role === 'mentor' && studentId === selectedUser ? convertToCalendarEventsMentor(data) : convertToCalendarEvents(data);
      console.log(parsedEvents);
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
      console.log(data[0].id,'--------------')
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

  const handleSubmit = async () => {
    try {


      if (role === 'student') {
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
        body: JSON.stringify({
          ...newFormData,
          id: editingEvent?.id,
        }),
      });

      if (response.ok) {
        // Update events without refreshing
        setToast({
          title: editingEvent ? "Activity Updated" : "Activity Added",
          description: editingEvent ? "Your activity has been updated successfully." : "Your activity has been added successfully.",
        });
        fetchEvents();
        handleClose();
        setTimeout(() => {
          setToast(null);
        }, 3000); // Adjust delay as needed
      } else {


        setToast({
          title: 'Error',
          description: 'Error saving activity. Please try again.',
        });
        setTimeout(() => setToast(null), 3000); // Hide toast after 3 seconds


      }

    } else if (role === 'mentor') {

      if (selectedUser===studentId) {

      const newFormData: FormData = {
        // studentId,
        date: formData.date,
        workingHours: workingHours,
        activities: notes,
      };
      console.log(newFormData);

      const response = await fetch("http://localhost:3000/api/mentor", {
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
        setToast({
          title: editingEvent ? "Activity Updated" : "Activity Added",
          description: editingEvent ? "Your activity has been updated successfully." : "Your activity has been added successfully.",
        });
        fetchEvents();
        handleClose();
        setTimeout(() => {
          setToast(null);
        }, 3000); // Adjust delay as needed
      } else {

        setToast({
          title: 'Error',
          description: 'Error saving activity. Please try again.',
        });
        setTimeout(() => setToast(null), 3000); // Hide toast after 3 seconds

            }
    } else {

      const newFormFeedbackData: FormData = {
        review: review,
        status: status,
        mentor: studentId
      }

      const Feedbackresponse = await fetch(`http://localhost:3000/api/mentorFeedback?activityId=${feedbackActivityId}`, {
        method:   "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newFormFeedbackData,
          id: editingEvent?.id,
        }),
      });    

      if ( Feedbackresponse.ok) {
        setToast({
          title: editingEvent ? "Feedback Updated" : "Feedback Added",
          description: editingEvent ? "Feedback has been updated." : "Feedback has been added successfully.",
        });
        fetchEvents();
        handleClose();
        setTimeout(() => {
          setToast(null);
        }, 3000); // Adjust delay as needed
      } else {
        setToast({
          title: 'Error',
          description: 'Error saving feedback. Please try again.',
        });
        setTimeout(() => setToast(null), 3000); // Hide toast after 3 seconds
      }
      
    }
      
    }

    } catch (error) {
      setToast({
        title: 'Error',
        description: 'Error saving activity. Please try again.',
      });
      setTimeout(() => setToast(null), 3000); // Hide toast after 3 seconds
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

  // Event Prop Getter to set custom styles
  const eventPropGetter = (event: CalendarEvent) => {
    let backgroundColor = "tealContrast"; // Default background color
    let textColor = "white"; // Default text color (white)
  
    // Customize based on event status
    if (event.status === "pending") {
      backgroundColor = "tealContrast"; // Yellow background for pending
      textColor = "white"; // Black text for better contrast
    } else if (event.status === "approved") {
      backgroundColor = "#25bd6a"; // Green background for accepted
      textColor = "white"; // White text for contrast
    } else if (event.status === "rejected") {
      backgroundColor = "#F25C54"; // Red background for rejected
      textColor = "white"; // White text for contrast
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
        <ToastProvider>


    {role==='mentor' && selectedUser !== studentId && (
          <AlertDialog open={taskModalOpen} onOpenChange={setTaskModalOpen}>
          <AlertDialogTrigger asChild>
            <div />
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-semibold text-gray-900">Mentor Task Detail</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription className="text-gray-700">
              <div className="flex gap-6 mb-4">
                <div className="w-1/2">
                  <span className="block text-sm font-medium text-black mb-1">Date</span>
                <Input type="date" value={formData.date} disabled className="text-black" />
                </div>
                <div className="w-1/2">
                  <span className="block text-sm font-medium text-black mb-1">Working Hours</span>
                  <Input
                  type="number"
                  value={workingHours}
                  disabled={true}
                  onChange={(e) => setWorkingHours(Number(e.target.value) || 0)}
                  placeholder="Enter working hours"
                />
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-black mb-2">Activity</h3>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter notes"
                  disabled={!false}
                  className="text-black"
                />
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-black mb-2">Review</h3>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Enter your review here..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-md bg-white"
                />
              </div>
            </AlertDialogDescription>
            <AlertDialogFooter className="flex justify-end gap-3 mt-4">
              <AlertDialogCancel onClick={setTaskModalOpen} className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-md">Close</AlertDialogCancel>
              <AlertDialogAction onClick={() => {setStatus('approved');}} className="bg-blue-500 text-white hover:bg-blue-700 px-4 py-2 rounded-md">Accept</AlertDialogAction>
              <AlertDialogAction  onClick={() => {setStatus('rejected');}}className="bg-red-500 text-white hover:bg-red-700 px-4 py-2 rounded-md">Reject</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    )}



    {(role==='mentor' && selectedUser === studentId)    && (
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
    )}


{ role==='student' && (
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
            toolbar: CustomToolbar,
          }}
          eventPropGetter={eventPropGetter} // Apply custom styles based on event status
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
