// Shape of a single report row returned from the API
export interface ReportRow {
  id: string;
  projectName: string;
  mentor: string;
  studentsCount: number;
  date: string;
  rawDate: string;
}

export const ITEMS_PER_PAGE = 5;

// Formats an date string for display
export function formatDisplayDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

// Formats an date string to input comparison
export function formatInputDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
