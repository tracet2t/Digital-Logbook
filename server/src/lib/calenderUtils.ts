// src/lib/calendarUtils.ts

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

export const eventPropGetter = (event: CalendarEvent) => {
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
      color: textColor,
    },
  };
};


export const convertToCalendarEvents = (data: any[]): CalendarEvent[] => {
    return data.map((item, index) => {
      const startDate = new Date(item.date);
      const endDate = new Date(item.date);
  
      return {
        id: index.toString(),
        title: item.notes || "No Title",
        start: startDate,
        end: endDate,
        status: item.feedback[0]?.status,
      };
    });
  };
  
  export const convertToCalendarEventsMentor = (data: any[]): CalendarEvent[] => {
    return data.map((item, index) => {
      const startDate = new Date(item.date);
      const endDate = new Date(item.date);
  
      return {
        id: index.toString(),
        title: item.activities || "No Title",
        start: startDate,
        end: endDate,
      };
    });
  };
  