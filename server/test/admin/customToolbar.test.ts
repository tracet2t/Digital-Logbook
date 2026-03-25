import fs from "node:fs";
import path from "node:path";
import moment from "moment";

// ============================================================================
// Source-based structural tests
// ============================================================================

describe("CustomToolbar - source structure", () => {
  const filePath = path.resolve(
    __dirname,
    "../../src/components/customToolbar.tsx",
  );

  const source = fs.readFileSync(filePath, "utf8");

  test("exports CustomToolbar as default", () => {
    expect(source).toContain("export default CustomToolbar;");
  });

  test("imports moment", () => {
    expect(source).toContain("import moment from 'moment'");
  });

  test("imports Button from ui/button", () => {
    expect(source).toContain("import { Button } from './ui/button'");
  });

  test("defines CustomToolbarProps interface with correct fields", () => {
    expect(source).toContain("toolbar: any;");
    expect(source).toContain("currentDate: Date;");
    expect(source).toContain("setCurrentDate: (date: Date) => void;");
  });

  test("goToBack navigates PREV", () => {
    expect(source).toContain('toolbar.onNavigate("PREV")');
  });

  test("goToNext navigates NEXT", () => {
    expect(source).toContain('toolbar.onNavigate("NEXT")');
  });

  test("back button subtracts 1 month from currentDate", () => {
    expect(source).toContain('moment(currentDate).subtract(1, "months").toDate()');
  });

  test("next button adds 1 month to currentDate", () => {
    expect(source).toContain('moment(currentDate).add(1, "months").toDate()');
  });

  test("displays date formatted as MMMM YYYY", () => {
    expect(source).toContain('moment(toolbar.date).format("MMMM YYYY")');
  });

  test("renders back button with < label", () => {
    expect(source).toContain('{"<"}');
  });

  test("renders next button with > label", () => {
    expect(source).toContain('{">"}');
  });

  test("layout uses flex justify-between", () => {
    expect(source).toContain("flex justify-between items-center mb-4");
  });
});

// ============================================================================
// Pure logic tests — month navigation
// ============================================================================

describe("CustomToolbar - month navigation logic", () => {
  test("subtracting 1 month from January gives December of previous year", () => {
    const jan = new Date("2026-01-01");
    const result = moment(jan).subtract(1, "months").toDate();
    expect(result.getMonth()).toBe(11); // December = 11
    expect(result.getFullYear()).toBe(2025);
  });

  test("adding 1 month to December gives January of next year", () => {
    const dec = new Date("2025-12-01");
    const result = moment(dec).add(1, "months").toDate();
    expect(result.getMonth()).toBe(0); // January = 0
    expect(result.getFullYear()).toBe(2026);
  });

  test("subtracting 1 month from March gives February", () => {
    const march = new Date("2026-03-01");
    const result = moment(march).subtract(1, "months").toDate();
    expect(result.getMonth()).toBe(1); // February = 1
  });

  test("adding 1 month to March gives April", () => {
    const march = new Date("2026-03-01");
    const result = moment(march).add(1, "months").toDate();
    expect(result.getMonth()).toBe(3); // April = 3
  });

  test("subtracting and adding 1 month returns to original month", () => {
    const original = new Date("2026-06-01");
    const back = moment(original).subtract(1, "months").toDate();
    const forward = moment(back).add(1, "months").toDate();
    expect(forward.getMonth()).toBe(original.getMonth());
    expect(forward.getFullYear()).toBe(original.getFullYear());
  });
});

// ============================================================================
// Pure logic tests — date display formatting
// ============================================================================

describe("CustomToolbar - date display formatting", () => {
  test("formats date as full month name and year", () => {
    const date = new Date("2026-03-01");
    const formatted = moment(date).format("MMMM YYYY");
    expect(formatted).toBe("March 2026");
  });

  test("formats January correctly", () => {
    const date = new Date("2026-01-01");
    const formatted = moment(date).format("MMMM YYYY");
    expect(formatted).toBe("January 2026");
  });

  test("formats December correctly", () => {
    const date = new Date("2025-12-01");
    const formatted = moment(date).format("MMMM YYYY");
    expect(formatted).toBe("December 2025");
  });

  test("month name is not abbreviated (full word)", () => {
    const date = new Date("2026-02-01");
    const formatted = moment(date).format("MMMM YYYY");
    expect(formatted).toBe("February 2026");
    expect(formatted).not.toBe("Feb 2026");
  });
});
