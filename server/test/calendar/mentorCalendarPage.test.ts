import React from "react";

import DashboardPage from "@/app/mentor/calendar/page";
import MentorDashboard from "@/components/mentorDashboard";

jest.mock("@/components/mentorDashboard", () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

describe("Mentor calendar page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns the MentorDashboard component", () => {
    const element = DashboardPage();

    expect(React.isValidElement(element)).toBe(true);
    expect(element.type).toBe(MentorDashboard);
    expect(element.props).toEqual({});
  });
});