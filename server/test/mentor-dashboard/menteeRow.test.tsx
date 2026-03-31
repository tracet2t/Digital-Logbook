import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// StatusBadge Component
function StatusBadge({
  status,
}: {
  status: "ACCEPTED" | "PENDING" | "REJECTED";
}) {
  const styles = {
    ACCEPTED: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    PENDING: "bg-amber-50 text-amber-700 border border-amber-100",
    REJECTED: "bg-rose-50 text-rose-700 border border-rose-100",
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-[11px] font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

// MenteeRow Component
function MenteeRow({
  initials,
  name,
  project,
  lastActivity,
  status,
}: {
  initials: string;
  name: string;
  project: string;
  lastActivity: string;
  status: "ACCEPTED" | "PENDING" | "REJECTED";
}) {
  const generateColor = (initials: string) => {
    const colors = [
      { bg: "bg-blue-100", text: "text-blue-700" },
      { bg: "bg-orange-100", text: "text-orange-700" },
      { bg: "bg-teal-100", text: "text-teal-700" },
      { bg: "bg-purple-100", text: "text-purple-700" },
      { bg: "bg-pink-100", text: "text-pink-700" },
      { bg: "bg-green-100", text: "text-green-700" },
      { bg: "bg-indigo-100", text: "text-indigo-700" },
      { bg: "bg-red-100", text: "text-red-700" },
    ];

    const charCode = initials.charCodeAt(0) + initials.charCodeAt(1);
    return colors[charCode % colors.length];
  };

  const colorSet = generateColor(initials);

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <td>
        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold text-sm ${colorSet.bg} ${colorSet.text}`}
          >
            {initials}
          </div>
          <span className="font-medium text-slate-900">{name}</span>
        </div>
      </td>
      <td className="text-slate-700">{project}</td>
      <td className="text-slate-700">{lastActivity}</td>
      <td>
        <StatusBadge status={status} />
      </td>
    </tr>
  );
}

describe("MenteeRow Component", () => {
  const defaultProps = {
    initials: "JD",
    name: "John Doe",
    project: "E-Commerce Platform",
    lastActivity: "2 hours ago",
    status: "ACCEPTED" as const,
  };

  it("should render mentee row with all information", () => {
    render(
      <table>
        <tbody>
          <MenteeRow {...defaultProps} />
        </tbody>
      </table>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("E-Commerce Platform")).toBeInTheDocument();
    expect(screen.getByText("2 hours ago")).toBeInTheDocument();
    expect(screen.getByText("ACCEPTED")).toBeInTheDocument();
  });

  it("should display initials in avatar", () => {
    render(
      <table>
        <tbody>
          <MenteeRow {...defaultProps} />
        </tbody>
      </table>
    );

    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("should have correct styling for name cell", () => {
    render(
      <table>
        <tbody>
          <MenteeRow {...defaultProps} />
        </tbody>
      </table>
    );

    const nameSpan = screen.getByText("John Doe");
    expect(nameSpan).toHaveClass("font-medium", "text-slate-900");
  });

  it("should have correct styling for project cell", () => {
    render(
      <table>
        <tbody>
          <MenteeRow {...defaultProps} />
        </tbody>
      </table>
    );

    const projectCell = screen.getByText("E-Commerce Platform");
    expect(projectCell).toHaveClass("text-slate-700");
  });

  it("should have correct styling for last activity cell", () => {
    render(
      <table>
        <tbody>
          <MenteeRow {...defaultProps} />
        </tbody>
      </table>
    );

    const activityCell = screen.getByText("2 hours ago");
    expect(activityCell).toHaveClass("text-slate-700");
  });

  it("should render ACCEPTED status badge", () => {
    render(
      <table>
        <tbody>
          <MenteeRow {...defaultProps} status="ACCEPTED" />
        </tbody>
      </table>
    );

    const badge = screen.getByText("ACCEPTED");
    expect(badge).toHaveClass("bg-emerald-50");
  });

  it("should render PENDING status badge", () => {
    render(
      <table>
        <tbody>
          <MenteeRow {...defaultProps} status="PENDING" />
        </tbody>
      </table>
    );

    const badge = screen.getByText("PENDING");
    expect(badge).toHaveClass("bg-amber-50");
  });

  it("should render REJECTED status badge", () => {
    render(
      <table>
        <tbody>
          <MenteeRow {...defaultProps} status="REJECTED" />
        </tbody>
      </table>
    );

    const badge = screen.getByText("REJECTED");
    expect(badge).toHaveClass("bg-rose-50");
  });

  it("should display avatar with correct size classes", () => {
    render(
      <table>
        <tbody>
          <MenteeRow {...defaultProps} />
        </tbody>
      </table>
    );

    const avatar = document.querySelector(
      "div[class*='h-8'][class*='w-8'][class*='rounded-full']"
    );
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass("h-8", "w-8");
  });

  it("should have row hover effect", () => {
    render(
      <table>
        <tbody>
          <MenteeRow {...defaultProps} />
        </tbody>
      </table>
    );

    const row = document.querySelector("tr");
    expect(row).toHaveClass("hover:bg-slate-50", "transition-colors");
  });

  it("should render multiple mentee rows correctly", () => {
    render(
      <table>
        <tbody>
          <MenteeRow
            initials="JD"
            name="John Doe"
            project="E-Commerce"
            lastActivity="2 hours ago"
            status="ACCEPTED"
          />
          <MenteeRow
            initials="SM"
            name="Sarah Miller"
            project="Mobile App"
            lastActivity="1 day ago"
            status="PENDING"
          />
        </tbody>
      </table>
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Sarah Miller")).toBeInTheDocument();
    expect(screen.getByText("E-Commerce")).toBeInTheDocument();
    expect(screen.getByText("Mobile App")).toBeInTheDocument();
  });

  it("should display different initials correctly", () => {
    const { rerender } = render(
      <table>
        <tbody>
          <MenteeRow {...defaultProps} initials="AB" />
        </tbody>
      </table>
    );

    expect(screen.getByText("AB")).toBeInTheDocument();

    rerender(
      <table>
        <tbody>
          <MenteeRow {...defaultProps} initials="XY" />
        </tbody>
      </table>
    );

    expect(screen.getByText("XY")).toBeInTheDocument();
  });

  it("should have border bottom styling", () => {
    render(
      <table>
        <tbody>
          <MenteeRow {...defaultProps} />
        </tbody>
      </table>
    );

    const row = document.querySelector("tr");
    expect(row).toHaveClass("border-b", "border-slate-100");
  });

  it("should render with flex layout for name column", () => {
    render(
      <table>
        <tbody>
          <MenteeRow {...defaultProps} />
        </tbody>
      </table>
    );

    const nameCell = document.querySelector("td:first-child > div");
    expect(nameCell).toHaveClass("flex", "items-center", "gap-3");
  });

  it("should have avatar with correct font styling", () => {
    render(
      <table>
        <tbody>
          <MenteeRow {...defaultProps} />
        </tbody>
      </table>
    );

    const avatar = document.querySelector(
      "div[class*='h-8'][class*='w-8'][class*='rounded-full']"
    );
    expect(avatar).toHaveClass("font-semibold", "text-sm");
  });

  it("should render activity time in correct cell position", () => {
    render(
      <table>
        <tbody>
          <MenteeRow {...defaultProps} lastActivity="5 minutes ago" />
        </tbody>
      </table>
    );

    expect(screen.getByText("5 minutes ago")).toBeInTheDocument();
  });

  it("should display name with initials avatar together", () => {
    render(
      <table>
        <tbody>
          <MenteeRow {...defaultProps} />
        </tbody>
      </table>
    );

    const firstCell = screen.getByText("JD").closest("tr")?.querySelector("td");
    expect(firstCell).toBeInTheDocument();
    expect(firstCell).toHaveTextContent("JD");
    expect(firstCell).toHaveTextContent("John Doe");
  });
});
