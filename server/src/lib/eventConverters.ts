// src/utils/eventConverters.ts

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
  