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

    return {
      id: index,
      title: item.notes || "No Title",
      start: startDate,
      end: endDate,
      status: item.feedback[0]?.status, // Add the status field
    };
  });
};

const convertToCalendarEventsMentor = (data: any[]): CalendarEvent[] => {
  return data.map((item, index) => {
    const startDate = new Date(item.date);
    const endDate = new Date(item.date); // Calculate end time
    // console.log(item.feedback[0]?.status);
    console.log(item);

    return {
      id: index,
      title: item.activities || "No Title",
      start: startDate,
      end: endDate,
      // status: item.feedback[0]?.status, // Add the status field
    };
  });
};

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

  const fetchEvents = async () => {
    try {
      console.log(role);
      if (role === 'student') {
        const response = await fetch(`http://localhost:3000/api/blogs?studentId=${studentId}`);
        const data = await response.json();
        console.log(data);
        const parsedEvents = convertToCalendarEvents(data);
        console.log(parsedEvents);
        setEvents(parsedEvents);        
      } else if (role === 'mentor') {


      if (studentId === selectedUser) {
        const response = await fetch(`http://localhost:3000/api/mentor?studentId=${selectedUser}`);
        const data = await response.json();
        const parsedEvents = convertToCalendarEventsMentor(data);
        setEvents(parsedEvents);

      } else {
    const response = await fetch(`http://localhost:3000/api/student?studentId=${selectedUser}`);
    const data = await response.json();
    const parsedEvents = convertToCalendarEvents(data);
    setEvents(parsedEvents);
      }

    }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchEvents();
    }
  }, [selectedUser]);

  const fetchEventForDate = async (formattedDate: string) => {
    try {
      if (role === 'student') {
        const response = await fetch(`http://localhost:3000/api/blogs?date=${formattedDate}`);
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
      } else if (role === 'mentor') {

        if (studentId===selectedUser) { 
          const response = await fetch(`http://localhost:3000/api/mentor?date=${formattedDate}&studentId=${selectedUser}`);
          const data = await response.json();
          console.log(data)
          if (data.length > 0) {
            const existingEvent = data[0];
            setFormData({
              studentId: existingEvent.studentId || "",
              date: formattedDate,
              timeSpent: existingEvent.workingHours || 0,
              notes: existingEvent.activities || "",
            });
            setWorkingHours(existingEvent.workingHours || 0);
            setNotes(existingEvent.activities || "");
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


        } else {
        const response = await fetch(`http://localhost:3000/api/student?date=${formattedDate}&studentId=${selectedUser}`);
        const data = await response.json();
        console.log('--------------------------------------',data[0].id);
        const feedbackResponse = await fetch(`http://localhost:3000/api/mentorFeedback?date=${formattedDate}&activityId=${data[0].id}`);
        setFeedbackActivityId(data[0].id);
        const feedbackData = await feedbackResponse.json();
        if (data.length > 0 && feedbackData ) {
          const existingEvent = data[0];
          setFormData({
            studentId: existingEvent.studentId || "",
            date: formattedDate,
            timeSpent: existingEvent.timeSpent || 0,
            notes: existingEvent.notes || "",
            review: feedbackData.feedbackNotes || "",
            status: feedbackData.status || "",
          });
          setWorkingHours(existingEvent.timeSpent || 0);
          setNotes(existingEvent.notes || "");
          setEditingEvent(existingEvent);
          setReview(feedbackData.feedbackNotes);
          // setStatus(feedbackData.status);
        } else if (data.length > 0) {
          const existingEvent = data[0];
          setFormData({
            studentId: existingEvent.studentId || "",
            date: formattedDate,
            timeSpent: existingEvent.timeSpent || 0,
            notes: existingEvent.notes || "",
            review: "",
            // status: ""
          });
          setWorkingHours(existingEvent.timeSpent || 0);
          setNotes(existingEvent.notes || "");
          setEditingEvent(existingEvent);
          setReview("");
          // setStatus("");
        } else {
          setFormData({
            studentId: "",
            date: formattedDate,
            timeSpent: 0,
            notes: "",
            review: "",
            // status: ""
          });
          setWorkingHours(0);
          setNotes("");
          setEditingEvent(null);
          setReview("");
          // setStatus("");
          setFeedbackActivityId("");
        }
      }
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
        console.log(newFormData);

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
        fetchEvents();
        handleClose();
      } else {
        console.error("Failed to save event:", await response.json());
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
        fetchEvents();
        handleClose();
      } else {
        console.error("Failed to save event:", await Feedbackresponse.json());
      }
      
    }
      
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
          onClick={() => {setCurrentDate(moment(currentDate).subtract(1, "months").toDate());goToBack()}}
          className="text-xl"
          >
          {"<"}
        </Button>
        <span className="text-2xl font-bold">{moment(toolbar.date).format("MMMM YYYY")}</span>
        <Button
          onClick={() => {setCurrentDate(moment(currentDate).subtract(1, "months").toDate());goToNext()}}
          className="text-xl"
        >
          {">"}
        </Button>
      </div>
    );
  };

  // Event Prop Getter to set custom styles
  const eventPropGetter = (event: CalendarEvent) => {
    let backgroundColor = "#FFD93D"; // Default background color
    let textColor = "#000000"; // Default text color (white)
  
    // Customize based on event status
    if (event.status === "pending") {
      backgroundColor = "#FFD93D"; // Yellow background for pending
      textColor = "#000000"; // Black text for better contrast
    } else if (event.status === "approved") {
      backgroundColor = "#6BCB77"; // Green background for accepted
      textColor = "#000000"; // White text for contrast
    } else if (event.status === "rejected") {
      backgroundColor = "#F25C54"; // Red background for rejected
      textColor = "#000000"; // White text for contrast
    }
  
    return {
      style: {
        backgroundColor,
        color: textColor, // Apply text color based on status
      },
    };
  };

  return (

    // role = mentor
    // selecteduser === usersessionid

    <>

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



    {(role==='mentor' && selectedUser === studentId)   || role==='student' && (
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
