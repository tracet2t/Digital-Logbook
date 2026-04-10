import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectCard } from "@/components/admin/kanban";
import { OnboardingApplication } from "@/hooks/admin/useAdminOnboarding";

jest.mock("@dnd-kit/core", () => ({
  useDroppable: jest.fn(() => ({
    setNodeRef: jest.fn(),
    isOver: false,
  })),
}));

const mockApplication: OnboardingApplication = {
  id: "1",
  fullName: "Jane Doe",
  email: "jane@example.com",
  university: "Tech University",
  degreeProgram: "Software Engineering",
  cvLink: "https://example.com/cv.pdf",
  status: "approved",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockProject = {
  id: "project-1",
  name: "AI Project",
  description: "Artificial Intelligence Research",
  batchNo: "Batch - 04",
};

describe("ProjectCard", () => {
  const mockOnUnassign = jest.fn();
  const mockOnViewProfile = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render project name", () => {
    render(
      <ProjectCard
        project={mockProject}
        assignedApplications={[]}
        onUnassign={mockOnUnassign}
        onViewProfile={mockOnViewProfile}
      />,
    );
    expect(screen.getByText("AI Project")).toBeInTheDocument();
  });

  it("should render project description", () => {
    render(
      <ProjectCard
        project={mockProject}
        assignedApplications={[]}
        onUnassign={mockOnUnassign}
        onViewProfile={mockOnViewProfile}
      />,
    );
    expect(screen.getByText("Artificial Intelligence Research")).toBeInTheDocument();
  });

  it("should render batch number", () => {
    render(
      <ProjectCard
        project={mockProject}
        assignedApplications={[]}
        onUnassign={mockOnUnassign}
        onViewProfile={mockOnViewProfile}
      />,
    );
    expect(screen.getByText("Batch - 04")).toBeInTheDocument();
  });

  it("should render drop placeholder when no applications assigned", () => {
    render(
      <ProjectCard
        project={mockProject}
        assignedApplications={[]}
        onUnassign={mockOnUnassign}
        onViewProfile={mockOnViewProfile}
      />,
    );
    expect(screen.getByText("Drop Member")).toBeInTheDocument();
  });

  it("should render assigned applications", () => {
    render(
      <ProjectCard
        project={mockProject}
        assignedApplications={[mockApplication]}
        onUnassign={mockOnUnassign}
        onViewProfile={mockOnViewProfile}
      />,
    );
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("should render multiple assigned applications", () => {
    const app2 = { ...mockApplication, id: "2", fullName: "John Smith" };
    render(
      <ProjectCard
        project={mockProject}
        assignedApplications={[mockApplication, app2]}
        onUnassign={mockOnUnassign}
        onViewProfile={mockOnViewProfile}
      />,
    );
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
  });

  it("should call onViewProfile when application is clicked", () => {
    render(
      <ProjectCard
        project={mockProject}
        assignedApplications={[mockApplication]}
        onUnassign={mockOnUnassign}
        onViewProfile={mockOnViewProfile}
      />,
    );
    const appElement = screen.getByText("Jane Doe").closest("div");
    if (appElement) fireEvent.click(appElement);
    expect(mockOnViewProfile).toHaveBeenCalledWith(mockApplication);
  });

  it("should call onUnassign when unassign button is clicked", () => {
    const { container } = render(
      <ProjectCard
        project={mockProject}
        assignedApplications={[mockApplication]}
        onUnassign={mockOnUnassign}
        onViewProfile={mockOnViewProfile}
      />,
    );
    const buttons = container.querySelectorAll("button");
    const unassignButton = Array.from(buttons).find(
      (btn) => btn.querySelector("svg") !== null,
    );
    if (unassignButton) fireEvent.click(unassignButton);
    expect(mockOnUnassign).toHaveBeenCalledWith(mockApplication.id);
  });

  it("should render project card with rounded styling", () => {
    const { container } = render(
      <ProjectCard
        project={mockProject}
        assignedApplications={[]}
        onUnassign={mockOnUnassign}
        onViewProfile={mockOnViewProfile}
      />,
    );
    const card = container.querySelector(".rounded-3xl");
    expect(card).toBeInTheDocument();
  });

  it("should have briefcase icon", () => {
    const { container } = render(
      <ProjectCard
        project={mockProject}
        assignedApplications={[]}
        onUnassign={mockOnUnassign}
        onViewProfile={mockOnViewProfile}
      />,
    );
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("should render min height of 280px", () => {
    const { container } = render(
      <ProjectCard
        project={mockProject}
        assignedApplications={[]}
        onUnassign={mockOnUnassign}
        onViewProfile={mockOnViewProfile}
      />,
    );
    const card = container.querySelector(".min-h-\\[280px\\]");
    expect(card).toBeInTheDocument();
  });

  it("should render application avatar initials", () => {
    render(
      <ProjectCard
        project={mockProject}
        assignedApplications={[mockApplication]}
        onUnassign={mockOnUnassign}
        onViewProfile={mockOnViewProfile}
      />,
    );
    expect(screen.getByText("JD")).toBeInTheDocument();
  });
});
