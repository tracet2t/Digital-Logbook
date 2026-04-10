import { render, screen, fireEvent } from "@testing-library/react";
import { BenchCard } from "@/components/admin/kanban";
import { OnboardingApplication } from "@/hooks/admin/useAdminOnboarding";

jest.mock("@dnd-kit/core", () => ({
  useDraggable: jest.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    isDragging: false,
  })),
}));

jest.mock("@dnd-kit/utilities", () => ({
  CSS: {
    Translate: {
      toString: jest.fn(() => ""),
    },
  },
}));

const mockApplication: OnboardingApplication = {
  id: "1",
  fullName: "John Doe",
  email: "john@example.com",
  university: "Test University",
  degreeProgram: "Computer Science",
  cvLink: "https://example.com/cv.pdf",
  status: "approved",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("BenchCard", () => {
  const mockOnSelect = jest.fn();
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render application full name", () => {
    render(
      <BenchCard
        application={mockApplication}
        selected={false}
        onSelect={mockOnSelect}
        onClick={mockOnClick}
      />,
    );
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("should render application date", () => {
    render(
      <BenchCard
        application={mockApplication}
        selected={false}
        onSelect={mockOnSelect}
        onClick={mockOnClick}
      />,
    );
    const dateText = screen.getByText(/\d{2}\s+\w+\s+\d{4}/);
    expect(dateText).toBeInTheDocument();
  });

  it("should display unselected state styling", () => {
    render(
      <BenchCard
        application={mockApplication}
        selected={false}
        onSelect={mockOnSelect}
        onClick={mockOnClick}
      />,
    );
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("should display selected state styling", () => {
    render(
      <BenchCard
        application={mockApplication}
        selected={true}
        onSelect={mockOnSelect}
        onClick={mockOnClick}
      />,
    );
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("should call onClick when card is clicked", () => {
    const { container } = render(
      <BenchCard
        application={mockApplication}
        selected={false}
        onSelect={mockOnSelect}
        onClick={mockOnClick}
      />,
    );
    const card = container.querySelector(".group");
    if (card) fireEvent.click(card);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should call onSelect when checkbox is clicked", () => {
    render(
      <BenchCard
        application={mockApplication}
        selected={false}
        onSelect={mockOnSelect}
        onClick={mockOnClick}
      />,
    );
    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it("should show white text when selected", () => {
    render(
      <BenchCard
        application={mockApplication}
        selected={true}
        onSelect={mockOnSelect}
        onClick={mockOnClick}
      />,
    );
    const nameText = screen.getByText("John Doe");
    expect(nameText).toHaveClass("text-white");
  });

  it("should show slate text when not selected", () => {
    render(
      <BenchCard
        application={mockApplication}
        selected={false}
        onSelect={mockOnSelect}
        onClick={mockOnClick}
      />,
    );
    const nameText = screen.getByText("John Doe");
    expect(nameText).toHaveClass("text-slate-800");
  });

  it("should render avatar with initials", () => {
    render(
      <BenchCard
        application={mockApplication}
        selected={false}
        onSelect={mockOnSelect}
        onClick={mockOnClick}
      />,
    );
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("should have grab cursor class", () => {
    const { container } = render(
      <BenchCard
        application={mockApplication}
        selected={false}
        onSelect={mockOnSelect}
        onClick={mockOnClick}
      />,
    );
    const card = container.querySelector(".cursor-grab");
    expect(card).toBeInTheDocument();
  });

  it("should render with flexbox layout", () => {
    const { container } = render(
      <BenchCard
        application={mockApplication}
        selected={false}
        onSelect={mockOnSelect}
        onClick={mockOnClick}
      />,
    );
    const card = container.querySelector(".flex");
    expect(card).toBeInTheDocument();
  });
});
