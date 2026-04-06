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
  status: "pending" | "approved" | "rejected"; // Added "no-status" for undefined cases
}

// Define a type for the raw data of students
interface StudentEventData {
  id: string;
  date: string;
  notes?: string;
  timeSpent?: number;
  studentId?: string;
  feedback?: { status?: "pending" | "approved" | "rejected" }[];
}

// Define a type for the raw data of mentors
interface MentorEventData {
  id: string;
  date: string;
  activities?: string;
  workingHours?: number;
  studentId?: string;
  status?: "pending" | "approved" | "rejected";
}

// Converts raw data to CalendarEvent for students
export const convertToCalendarEvents = (data: StudentEventData[]): CalendarEvent[] => {
  return data.map((item) => {
    const startDate = new Date(item.date);
    const endDate = new Date(item.date);

    return {
      id: item.id,
      title: item.notes || "No Title",
      start: startDate,
      end: endDate,
      status: item.feedback?.[0]?.status || "pending",
      createdAt: new Date(),
      studentId: item.studentId || '',
      timeSpent: item.timeSpent,
      notes: item.notes,
    };
  });
};

// Converts raw data to CalendarEvent for mentors
export const convertToCalendarEventsMentor = (data: MentorEventData[]): CalendarEvent[] => {
  return data.map((item) => {
    const startDate = new Date(item.date);
    const endDate = new Date(item.date);

    return {
      id: item.id,
      title: item.activities || "No Title",
      start: startDate,
      end: endDate,
      status: item.status || "pending",
      createdAt: new Date(),
      studentId: item.studentId || '',
      timeSpent: item.workingHours,
      notes: item.activities,
    };
  });
};

// Styles for calendar events
export const eventPropGetter = (event: CalendarEvent, selectedUser: string) => {
  let backgroundColor = "#3a5ac7"; // Default background color
  let textColor = "white"; // Default text color (white)

  // Customize based on event status
  switch (event.status) {
    case "pending":
      backgroundColor = "#3a5ac7"; // Teal for pending
      break;
    case "approved":
      backgroundColor = "#25bd6a"; // Green for approved
      break;
    case "rejected":
      backgroundColor = "#F25C54"; // Red for rejected
      break;
    default:
      backgroundColor = "#3a5ac7"; // Default color if status is "no-status" or undefined
      break;
  }

  return {
    style: {
      backgroundColor,
      color: textColor,
    },
  };
};
