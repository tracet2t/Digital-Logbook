import { render, screen } from "@testing-library/react";
import { ApplicantDialog } from "@/components/admin/kanban";
import { OnboardingApplication } from "@/hooks/admin/useAdminOnboarding";

jest.mock("@/components/admin", () => ({
  AdminStatusBadge: ({ status }: { status: string }) => (
    <div data-testid="status-badge">{status}</div>
  ),
}));

const mockApplication: OnboardingApplication = {
  id: "1",
  fullName: "Alice Johnson",
  email: "alice@example.com",
  university: "Harvard University",
  degreeProgram: "Computer Science",
  cvLink: "https://example.com/alice-cv.pdf",
  status: "approved",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("ApplicantDialog", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render when application is null", () => {
    const { container } = render(
      <ApplicantDialog application={null} onClose={mockOnClose} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render applicant name", () => {
    render(
      <ApplicantDialog application={mockApplication} onClose={mockOnClose} />,
    );
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
  });

  it("should render applicant email", () => {
    render(
      <ApplicantDialog application={mockApplication} onClose={mockOnClose} />,
    );
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
  });

  it("should render university name", () => {
    render(
      <ApplicantDialog application={mockApplication} onClose={mockOnClose} />,
    );
    expect(screen.getByText("Harvard University")).toBeInTheDocument();
  });

  it("should render degree program", () => {
    render(
      <ApplicantDialog application={mockApplication} onClose={mockOnClose} />,
    );
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
  });

  it("should render submission date", () => {
    render(
      <ApplicantDialog application={mockApplication} onClose={mockOnClose} />,
    );
    expect(screen.getByText(/Submitted/)).toBeInTheDocument();
  });

  it("should render status badge", () => {
    render(
      <ApplicantDialog application={mockApplication} onClose={mockOnClose} />,
    );
    const statusBadge = screen.getByTestId("status-badge");
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveTextContent("approved");
  });

  it("should render CV link", () => {
    render(
      <ApplicantDialog application={mockApplication} onClose={mockOnClose} />,
    );
    const cvLink = screen.getByRole("link", { name: /Open submitted CV/i });
    expect(cvLink).toBeInTheDocument();
    expect(cvLink).toHaveAttribute("href", "https://example.com/alice-cv.pdf");
    expect(cvLink).toHaveAttribute("target", "_blank");
    expect(cvLink).toHaveAttribute("rel", "noreferrer");
  });

  it("should render external link icon", () => {
    render(
      <ApplicantDialog application={mockApplication} onClose={mockOnClose} />,
    );
    expect(screen.getByText(/Open submitted CV/i)).toBeInTheDocument();
  });

  it("should render dialog title text", () => {
    render(
      <ApplicantDialog application={mockApplication} onClose={mockOnClose} />,
    );
    expect(screen.getByText("Onboarding submission details.")).toBeInTheDocument();
  });

  it("should render all icon labels", () => {
    render(
      <ApplicantDialog application={mockApplication} onClose={mockOnClose} />,
    );
    expect(screen.getByText("CV")).toBeInTheDocument();
  });

  it("should render avatar with initials", () => {
    render(
      <ApplicantDialog application={mockApplication} onClose={mockOnClose} />,
    );
    expect(screen.getByText("AJ")).toBeInTheDocument();
  });

  it("should have dialog with correct styling", () => {
    render(
      <ApplicantDialog application={mockApplication} onClose={mockOnClose} />,
    );
    expect(screen.getByText("Onboarding submission details.")).toBeInTheDocument();
  });
});
