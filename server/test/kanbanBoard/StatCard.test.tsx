import { render, screen } from "@testing-library/react";
import { Activity, AlertCircle, CheckCircle, PieChart } from "lucide-react";

import { StatCard } from "@/components/admin/kanban";

describe("StatCard", () => {
  it("should render label and value", () => {
    render(
      <StatCard label="Total Users" value={42} icon={Activity} tone="slate" />,
    );
    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("should render with slate tone styling", () => {
    const { container } = render(
      <StatCard label="Slate Stat" value={10} icon={Activity} tone="slate" />,
    );
    const toneDiv = container.querySelector(
      ".bg-slate-50.text-slate-600.border-slate-200",
    );
    expect(toneDiv).toBeInTheDocument();
  });

  it("should render with amber tone styling", () => {
    const { container } = render(
      <StatCard label="Amber Stat" value={20} icon={AlertCircle} tone="amber" />,
    );
    const toneDiv = container.querySelector(
      ".bg-amber-50.text-amber-600.border-amber-200",
    );
    expect(toneDiv).toBeInTheDocument();
  });

  it("should render with emerald tone styling", () => {
    const { container } = render(
      <StatCard
        label="Emerald Stat"
        value={30}
        icon={CheckCircle}
        tone="emerald"
      />,
    );
    const toneDiv = container.querySelector(
      ".bg-emerald-50.text-emerald-600.border-emerald-200",
    );
    expect(toneDiv).toBeInTheDocument();
  });

  it("should render with rose tone styling", () => {
    const { container } = render(
      <StatCard label="Rose Stat" value={5} icon={PieChart} tone="rose" />,
    );
    const toneDiv = container.querySelector(
      ".bg-rose-50.text-rose-600.border-rose-200",
    );
    expect(toneDiv).toBeInTheDocument();
  });

  it("should display large number correctly", () => {
    render(
      <StatCard label="Large Number" value={9999} icon={Activity} tone="slate" />,
    );
    expect(screen.getByText("9999")).toBeInTheDocument();
  });

  it("should display zero value", () => {
    render(
      <StatCard label="Zero Value" value={0} icon={Activity} tone="slate" />,
    );
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
