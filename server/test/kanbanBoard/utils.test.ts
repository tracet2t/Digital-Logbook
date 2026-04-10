import { formatDate, getInitials } from "@/components/admin/kanban/utils";

describe("Kanban Board Utils", () => {
  describe("formatDate", () => {
    it("should format date in en-GB format", () => {
      const result = formatDate("2026-04-11");
      expect(result).toMatch(/11\s+Apr\s+2026/);
    });

    it("should handle ISO string format", () => {
      const result = formatDate("2026-04-11T10:30:00Z");
      expect(result).toMatch(/11\s+Apr\s+2026/);
    });

    it("should handle different months", () => {
      const result = formatDate("2026-01-15");
      expect(result).toMatch(/15\s+Jan\s+2026/);
    });

    it("should handle single digit dates", () => {
      const result = formatDate("2026-04-05");
      expect(result).toMatch(/05\s+Apr\s+2026/);
    });

    it("should handle leap year date", () => {
      const result = formatDate("2024-02-29");
      expect(result).toMatch(/29\s+Feb\s+2024/);
    });
  });

  describe("getInitials", () => {
    it("should get initials from two-word name", () => {
      const result = getInitials("John Doe");
      expect(result).toBe("JD");
    });

    it("should get first initial from single-word name", () => {
      const result = getInitials("Cher");
      expect(result).toBe("C");
    });

    it("should get initials from three-word name (first two words)", () => {
      const result = getInitials("John Michael Doe");
      expect(result).toBe("JM");
    });

    it("should handle leading/trailing spaces", () => {
      const result = getInitials("  John Doe  ");
      expect(result).toBe("JD");
    });

    it("should handle multiple spaces between words", () => {
      const result = getInitials("John    Doe");
      expect(result).toBe("JD");
    });

    it("should handle empty string", () => {
      const result = getInitials("");
      expect(result).toBe("");
    });

    it("should handle lowercase names", () => {
      const result = getInitials("john doe");
      expect(result).toBe("JD");
    });

    it("should handle mixed case", () => {
      const result = getInitials("JoHn DoE");
      expect(result).toBe("JD");
    });

    it("should handle single character per word", () => {
      const result = getInitials("A B");
      expect(result).toBe("AB");
    });
  });
});
