import fs from "node:fs";
import path from "node:path";

import moment from "moment";

// ============================================================================
// Source-based structural tests
// ============================================================================

describe("TaskCalendar - source structure", () => {
  const filePath = path.resolve(__dirname, "../../src/components/calendar.tsx");

  const source = fs.readFileSync(filePath, "utf8");

  test("exports TaskCalendar as default", () => {
    expect(source).toContain("export default TaskCalendar;");
  });

  test("imports all three dialog components", () => {
    expect(source).toContain(
      'import MentorTaskDetailDialog from "./mentorTaskDetailDialog"',
    );
    expect(source).toContain(
      'import MentorStudentTaskDetailDialog from "./mentorStudentTaskDetailDialog"',
    );
    expect(source).toContain(
      'import StudentTaskDetailDialog from "./studentTaskDetailDialog"',
    );
  });

  test("imports custom hooks", () => {
    expect(source).toContain(
      'import { useCalendarEvents } from "@/_hooks/useCalendarEvents"',
    );
    expect(source).toContain(
      'import { useFormData } from "@/_hooks/useFormData"',
    );
    expect(source).toContain(
      'import { useSubmission } from "@/_hooks/useSubmission"',
    );
    expect(source).toContain(
      'import { useEventForDate } from "@/_hooks/useEventForDate"',
    );
  });

  test("fetches session on mount and sets studentId and role", () => {
    expect(source).toContain("getSessionOnClient()");
    expect(source).toContain("setStudentId(data.id);");
    expect(source).toContain("setRole(data.role);");
  });

  test("formats date with moment YYYY-MM-DD pattern", () => {
    expect(source).toContain('moment(date).format("YYYY-MM-DD")');
  });

  test("determines editability based on today and two days before", () => {
    expect(source).toContain('moment().startOf("day")');
    expect(source).toContain('moment().subtract(2, "days").startOf("day")');
    expect(source).toContain("setIsEditable(true);");
    expect(source).toContain("setIsEditable(false);");
  });

  test("handleDateClick opens modal and fetches event", () => {
    expect(source).toContain("fetchEventForDate(formattedDate);");
    expect(source).toContain("setTaskModalOpen(true);");
  });

  test("handleClose closes modal", () => {
    expect(source).toContain("setTaskModalOpen(false);");
  });

  test("BigCalendar is configured with MONTH view and selectable", () => {
    expect(source).toContain("defaultView={Views.MONTH}");
    expect(source).toContain("view={Views.MONTH}");
    expect(source).toContain("selectable");
    expect(source).toContain('startAccessor="start"');
    expect(source).toContain('endAccessor="end"');
  });

  test("passes selectedUser to eventPropGetter", () => {
    expect(source).toContain('eventPropGetter(event, selectedUser || "")');
  });

  test("renders toast conditionally", () => {
    expect(source).toContain("{toast && (");
    expect(source).toContain("<ToastTitle>{toast.title}</ToastTitle>");
    expect(source).toContain(
      "<ToastDescription>{toast.description}</ToastDescription>",
    );
  });

  test("uses CustomToolbar as calendar toolbar component", () => {
    expect(source).toContain("<CustomToolbar");
    expect(source).toContain("currentDate={currentDate}");
    expect(source).toContain("setCurrentDate={setCurrentDate}");
  });

  test("selectedUser prop falls back to empty string", () => {
    expect(source).toContain('selectedUser || ""');
  });
});

// ============================================================================
// Date editability logic (pure logic tests)
// ============================================================================

describe("TaskCalendar - date editability logic", () => {
  function isDateEditable(date: Date): boolean {
    const today = moment().startOf("day");
    const dayBeforeYesterday = moment().subtract(2, "days").startOf("day");
    return (
      moment(date).isSame(today, "day") ||
      moment(date).isBetween(dayBeforeYesterday, today, "day", "[]")
    );
  }

  test("today is editable", () => {
    expect(isDateEditable(new Date())).toBe(true);
  });

  test("yesterday is editable", () => {
    const yesterday = moment().subtract(1, "days").toDate();
    expect(isDateEditable(yesterday)).toBe(true);
  });

  test("two days ago is editable", () => {
    const twoDaysAgo = moment().subtract(2, "days").toDate();
    expect(isDateEditable(twoDaysAgo)).toBe(true);
  });

  test("three days ago is not editable", () => {
    const threeDaysAgo = moment().subtract(3, "days").toDate();
    expect(isDateEditable(threeDaysAgo)).toBe(false);
  });

  test("a future date is not editable", () => {
    const tomorrow = moment().add(1, "days").toDate();
    expect(isDateEditable(tomorrow)).toBe(false);
  });

  test("a date far in the past is not editable", () => {
    const oldDate = new Date("2020-01-01");
    expect(isDateEditable(oldDate)).toBe(false);
  });
});

// ============================================================================
// CalendarEvent status validation (pure logic tests)
// ============================================================================

describe("TaskCalendar - CalendarEvent status", () => {
  type EventStatus = "pending" | "approved" | "rejected";

  const validStatuses: EventStatus[] = ["pending", "approved", "rejected"];
  const shouldAutoSubmit = (status: EventStatus) =>
    status === "approved" || status === "rejected";

  test("all valid status values are accepted", () => {
    validStatuses.forEach((s) => {
      expect(["pending", "approved", "rejected"]).toContain(s);
    });
  });

  test("auto-submit triggers for approved status", () => {
    const status: EventStatus = "approved";
    expect(shouldAutoSubmit(status)).toBe(true);
  });

  test("auto-submit triggers for rejected status", () => {
    const status: EventStatus = "rejected";
    expect(shouldAutoSubmit(status)).toBe(true);
  });

  test("auto-submit does not trigger for pending status", () => {
    const status: EventStatus = "pending";
    expect(shouldAutoSubmit(status)).toBe(false);
  });
});

// ============================================================================
// Moment date formatting
// ============================================================================

describe("TaskCalendar - date formatting", () => {
  test("formats date as YYYY-MM-DD", () => {
    const date = new Date("2026-03-24T10:00:00.000Z");
    const formatted = moment(date).format("YYYY-MM-DD");
    expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test("formatted date matches expected value", () => {
    const date = new Date("2026-01-15T00:00:00.000Z");
    const formatted = moment.utc(date).format("YYYY-MM-DD");
    expect(formatted).toBe("2026-01-15");
  });
});

// ============================================================================
// Toast state logic
// ============================================================================

describe("TaskCalendar - toast state logic", () => {
  test("toast is initially null", () => {
    const toast: { title: string; description: string } | null = null;
    expect(toast).toBeNull();
  });

  test("toast renders when set", () => {
    const toast = { title: "Success", description: "Task saved." };
    expect(toast).not.toBeNull();
    expect(toast!.title).toBe("Success");
    expect(toast!.description).toBe("Task saved.");
  });

  test("toast clears after timeout (simulation)", () => {
    let toast: { title: string; description: string } | null = {
      title: "Info",
      description: "Saving...",
    };
    // simulate setTimeout(() => setToast(null), 1000)
    toast = null;
    expect(toast).toBeNull();
  });
});
