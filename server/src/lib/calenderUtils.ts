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
  date: string;
  notes?: string;
  feedback?: { status?: "pending" | "approved" | "rejected" }[];
}

// Define a type for the raw data of mentors
interface MentorEventData {
  date: string;
  activities?: string;
  status?: "pending" | "approved" | "rejected";
}

// Converts raw data to CalendarEvent for students
export const convertToCalendarEvents = (data: StudentEventData[]): CalendarEvent[] => {
  return data.map((item, index) => {
    const startDate = new Date(item.date);
    const endDate = new Date(item.date);

    return {
      id: index.toString(),
      title: item.notes || "No Title",
      start: startDate,
      end: endDate,
      status: item.feedback?.[0]?.status || "pending", // Handle undefined feedback/status
      createdAt: new Date(), // Adjust as needed
      studentId: '', // Provide a default or map from your data if available
    };
  });
};

// Converts raw data to CalendarEvent for mentors
export const convertToCalendarEventsMentor = (data: MentorEventData[]): CalendarEvent[] => {
  return data.map((item, index) => {
    const startDate = new Date(item.date);
    const endDate = new Date(item.date);

    return {
      id: index.toString(),
      title: item.activities || "No Title",
      start: startDate,
      end: endDate,
      status: item.status || "pending", // Assuming mentor data has some status field too
      createdAt: new Date(), // Adjust as needed
      studentId: '', // Provide a default or map from your data if available
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
