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

export const eventPropGetter = (event: CalendarEvent, selectedUser: string) => {
  let backgroundColor = "#3a5ac7"; // Default background color
  let textColor = "white"; // Default text color (white)

  // Customize based on event status
  if (event.status === "pending") {
    backgroundColor = "#3a5ac7"; // Teal for pending
  } else if (event.status === "approved") {
    backgroundColor = "#25bd6a"; // Green for approved
  } else if (event.status === "rejected") {
    backgroundColor = "#F25C54"; // Red for rejected
  } 

  return {
    style: {
      backgroundColor,
      color: textColor,
    },
  };
};

// Converts raw data to CalendarEvent for students
export const convertToCalendarEvents = (data: any[]): CalendarEvent[] => {
  return data.map((item, index) => {
    const startDate = new Date(item.date);
    const endDate = new Date(item.date);

    return {
      id: index.toString(),
      title: item.notes || "No Title",
      start: startDate,
      end: endDate,
      status: item.feedback?.[0]?.status || "pending", // Handle undefined feedback/status
    };
  });
};

// Converts raw data to CalendarEvent for mentors
export const convertToCalendarEventsMentor = (data: any[]): CalendarEvent[] => {
  return data.map((item, index) => {
    const startDate = new Date(item.date);
    const endDate = new Date(item.date);

    return {
      id: index.toString(),
      title: item.activities || "No Title",
      start: startDate,
      end: endDate,
      status: item.status || "pending", // Assuming mentor data has some status field too
    };
  });
};