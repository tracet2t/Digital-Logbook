import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// StatCard Component
function StatCard({
  label,
  value,
  icon,
  isLoading = false,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  isLoading?: boolean;
}) {
  return (
    <div className="p-4 border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {isLoading ? (
              <span className="inline-block h-8 w-16 animate-pulse rounded bg-slate-200" />
            ) : (
              value
            )}
          </p>
        </div>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
    </div>
  );
}

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

describe("StatCard Component", () => {
  const mockIcon = <div data-testid="mock-icon">Icon</div>;

  it("should render stat card with label and value", () => {
    render(
      <StatCard label="Total Mentees" value={12} icon={mockIcon} />
    );

    expect(screen.getByText("Total Mentees")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("should render stat card with string value", () => {
    render(
      <StatCard label="Working Hours" value="240h" icon={mockIcon} />
    );

    expect(screen.getByText("Working Hours")).toBeInTheDocument();
    expect(screen.getByText("240h")).toBeInTheDocument();
  });

  it("should display loading skeleton when isLoading is true", () => {
    render(
      <StatCard label="Total Mentees" value={12} icon={mockIcon} isLoading={true} />
    );

    const skeleton = document.querySelector(".animate-pulse");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass("h-8", "w-16");
  });

  it("should render icon when provided", () => {
    render(
      <StatCard label="Total Mentees" value={12} icon={mockIcon} />
    );

    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });

  it("should render label in uppercase tracking", () => {
    render(
      <StatCard label="total mentees" value={12} icon={mockIcon} />
    );

    const labelElement = screen.getByText("total mentees");
    expect(labelElement).toHaveClass("uppercase", "tracking-[0.2em]");
  });

  it("should render value in large bold text", () => {
    render(
      <StatCard label="Projects" value={5} icon={mockIcon} />
    );

    const valueElement = screen.getByText("5");
    expect(valueElement).toHaveClass("text-3xl", "font-bold");
  });

  it("should not show value when loading", () => {
    render(
      <StatCard label="Total Mentees" value={12} icon={mockIcon} isLoading={true} />
    );

    expect(screen.queryByText("12")).not.toBeInTheDocument();
  });

  it("should have correct border and shadow styling", () => {
    const { container } = render(
      <StatCard label="Total Mentees" value={12} icon={mockIcon} />
    );

    const card = container.querySelector(".border-slate-200.shadow-sm");
    expect(card).toBeInTheDocument();
  });

  it("should render multiple stat cards independently", () => {
    const { rerender } = render(
      <>
        <StatCard label="Mentees" value={12} icon={mockIcon} />
        <StatCard label="Projects" value={5} icon={mockIcon} />
      </>
    );

    expect(screen.getByText("Mentees")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should display zero value correctly", () => {
    render(
      <StatCard label="Active Projects" value={0} icon={mockIcon} />
    );

    expect(screen.getByText("0")).toBeInTheDocument();
  });
});

describe("StatusBadge Component", () => {
  it("should render ACCEPTED status with correct styling", () => {
    render(<StatusBadge status="ACCEPTED" />);

    const badge = screen.getByText("ACCEPTED");
    expect(badge).toHaveClass("bg-emerald-50", "text-emerald-700");
    expect(badge).toBeInTheDocument();
  });

  it("should render PENDING status with correct styling", () => {
    render(<StatusBadge status="PENDING" />);

    const badge = screen.getByText("PENDING");
    expect(badge).toHaveClass("bg-amber-50", "text-amber-700");
    expect(badge).toBeInTheDocument();
  });

  it("should render REJECTED status with correct styling", () => {
    render(<StatusBadge status="REJECTED" />);

    const badge = screen.getByText("REJECTED");
    expect(badge).toHaveClass("bg-rose-50", "text-rose-700");
    expect(badge).toBeInTheDocument();
  });

  it("should have correct border for all statuses", () => {
    const { rerender } = render(<StatusBadge status="ACCEPTED" />);

    let badge = screen.getByText("ACCEPTED");
    expect(badge).toHaveClass("border");

    rerender(<StatusBadge status="PENDING" />);
    badge = screen.getByText("PENDING");
    expect(badge).toHaveClass("border");

    rerender(<StatusBadge status="REJECTED" />);
    badge = screen.getByText("REJECTED");
    expect(badge).toHaveClass("border");
  });

  it("should have rounded-full and padding classes", () => {
    render(<StatusBadge status="ACCEPTED" />);

    const badge = screen.getByText("ACCEPTED");
    expect(badge).toHaveClass("rounded-full", "px-2", "py-1");
  });

  it("should have correct font styling", () => {
    render(<StatusBadge status="ACCEPTED" />);

    const badge = screen.getByText("ACCEPTED");
    expect(badge).toHaveClass("text-[11px]", "font-semibold");
  });

  it("should render all three status types correctly", () => {
    const { rerender } = render(<StatusBadge status="ACCEPTED" />);
    expect(screen.getByText("ACCEPTED")).toBeInTheDocument();

    rerender(<StatusBadge status="PENDING" />);
    expect(screen.getByText("PENDING")).toBeInTheDocument();

    rerender(<StatusBadge status="REJECTED" />);
    expect(screen.getByText("REJECTED")).toBeInTheDocument();
  });

  it("should badge have class to distinguish from text", () => {
    render(<StatusBadge status="ACCEPTED" />);

    const badge = screen.getByText("ACCEPTED");
    expect(badge.className).toMatch(/rounded-full/);
    expect(badge.className).toMatch(/px-2/);
  });
});
