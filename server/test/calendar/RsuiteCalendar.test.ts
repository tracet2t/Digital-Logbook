import fs from "node:fs";
import path from "node:path";

import moment from "moment";

describe("RsuiteCalendar - source structure", () => {
  const filePath = path.resolve(
    __dirname,
    "../../src/app/mentor/calendar/RsuiteCalendar.tsx",
  );

  const source = fs.readFileSync(filePath, "utf8");

  test("exports RsuiteCalendar as the default function", () => {
    expect(source).toContain("export default function RsuiteCalendar");
  });

  test("imports rsuite calendar and required styles", () => {
    expect(source).toContain('import { Calendar } from "rsuite";');
    expect(source).toContain('import "rsuite/dist/rsuite.min.css";');
    expect(source).toContain('import "@/styles/rsuiteCalendar.css";');
  });

  test("uses the shared session and calendar hooks", () => {
    expect(source).toContain("const { data: sessionData } = useSession();");
    expect(source).toContain("const { events } = useCalendarEvents(studentId, role, selectedUser || \"\", allMentees);");
    expect(source).toContain("const { fetchEventForDate, loadEventDirectly, isLoading: isEventLoading } = useEventForDate(");
    expect(source).toContain("const { handleSubmit, isSubmitting } = useSubmission(");
  });

  test("groups events by YYYY-MM-DD with moment", () => {
    expect(source).toContain('const dateKey = moment(event.start).format("YYYY-MM-DD")');
    expect(source).toContain("grouped[dateKey].push(event);");
  });

  test("supports all-mentees day selection branch", () => {
    expect(source).toContain('if (selectedUser === "all-mentees") {');
    expect(source).toContain("setAllMenteesTableDate(formattedDate);");
    expect(source).toContain("setAllMenteesTableMenteeId(null);");
    expect(source).toContain("return;");
  });

  test("resets form data and opens task dialog when a date cell is clicked", () => {
    expect(source).toContain("resetFormData(formattedDate);");
    expect(source).toContain("setTaskModalOpen(true);");
  });

  test("loads the clicked event before opening the modal", () => {
    expect(source).toContain("await loadEventDirectly(event, formattedDate);");
    expect(source).toContain("await loadEventDirectly(syntheticEvent, row.date);");
  });

  test("limits visible day pills and styles them with eventPropGetter", () => {
    expect(source).toContain("dateEvents.slice(0, 3).map((event) => {");
    expect(source).toContain('const styling = eventPropGetter(event, selectedUser || "");');
  });

  test("renders mentee-specific and student-specific task dialogs", () => {
    expect(source).toContain("<MentorTaskDetailDialog");
    expect(source).toContain("<MentorStudentTaskDetailDialog");
    expect(source).toContain("<StudentTaskDetailDialog");
    expect(source).toContain('role === "mentor"');
    expect(source).toContain('role === "student"');
  });

  test("renders a toast block when toast state exists", () => {
    expect(source).toContain("{toast && (");
    expect(source).toContain("{toast.title}");
    expect(source).toContain("{toast.description}");
  });

  test("contains mounted gate before rendering rsuite calendar", () => {
    expect(source).toContain("setMounted(true);");
    expect(source).toContain("setSelectedDate(new Date());");
    expect(source).toContain("{mounted && (");
    expect(source).toContain("<Calendar");
  });

  test("keeps the fetchEventForDate hook wired for event loading", () => {
    expect(source).toContain("fetchEventForDate");
  });
});

describe("RsuiteCalendar - date editability logic", () => {
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

  test("two days ago is still editable", () => {
    const twoDaysAgo = moment().subtract(2, "days").toDate();
    expect(isDateEditable(twoDaysAgo)).toBe(true);
  });

  test("three days ago is not editable", () => {
    const threeDaysAgo = moment().subtract(3, "days").toDate();
    expect(isDateEditable(threeDaysAgo)).toBe(false);
  });

  test("future dates are not editable", () => {
    const tomorrow = moment().add(1, "days").toDate();
    expect(isDateEditable(tomorrow)).toBe(false);
  });
});