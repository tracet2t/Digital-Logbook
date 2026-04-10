import { render, screen, fireEvent } from "@testing-library/react";
import { KanbanBoard } from "@/components/admin/kanban";
import { OnboardingApplication } from "@/hooks/admin/useAdminOnboarding";

jest.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DragOverlay: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useSensor: jest.fn(),
  useSensors: jest.fn(() => []),
  PointerSensor: jest.fn(),
  useDraggable: jest.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    isDragging: false,
  })),
  useDroppable: jest.fn(() => ({
    setNodeRef: jest.fn(),
    isOver: false,
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
  fullName: "Test User",
  email: "test@example.com",
  university: "Test University",
  degreeProgram: "CS",
  cvLink: "https://example.com/cv.pdf",
  status: "approved",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockProject = {
  id: "project-1",
  name: "Project 1",
  description: "Test project",
  batchNo: "Batch - 01",
};

describe("KanbanBoard", () => {
  const mockHandleDragStart = jest.fn();
  const mockHandleDragEnd = jest.fn();
  const mockHandleUnassign = jest.fn();
  const mockOnViewProfile = jest.fn();
  const mockOnAddProject = jest.fn();
  const mockSetSelectedIds = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render bench label and badge", () => {
    render(
      <KanbanBoard
        benchLabel="BENCH"
        benchBadgeText="People"
        benchEmptyText="No applicants"
        assignmentLabel="ASSIGNMENTS"
        bench={[]}
        isLoading={false}
        applications={[]}
        assignments={{}}
        projects={[]}
        projectsLoading={false}
        selectedIds={new Set()}
        setSelectedIds={mockSetSelectedIds}
        handleDragStart={mockHandleDragStart}
        handleDragEnd={mockHandleDragEnd}
        handleUnassign={mockHandleUnassign}
        activeApplication={null}
        dragCount={0}
        onViewProfile={mockOnViewProfile}
        onAddProject={mockOnAddProject}
      />,
    );
    expect(screen.getByText("BENCH")).toBeInTheDocument();
  });

  it("should render assignment label", () => {
    render(
      <KanbanBoard
        benchLabel="BENCH"
        benchBadgeText="People"
        benchEmptyText="No applicants"
        assignmentLabel="ASSIGNMENTS"
        bench={[]}
        isLoading={false}
        applications={[]}
        assignments={{}}
        projects={[]}
        projectsLoading={false}
        selectedIds={new Set()}
        setSelectedIds={mockSetSelectedIds}
        handleDragStart={mockHandleDragStart}
        handleDragEnd={mockHandleDragEnd}
        handleUnassign={mockHandleUnassign}
        activeApplication={null}
        dragCount={0}
        onViewProfile={mockOnViewProfile}
        onAddProject={mockOnAddProject}
      />,
    );
    expect(screen.getByText("ASSIGNMENTS")).toBeInTheDocument();
  });

  it("should display bench count badge", () => {
    render(
      <KanbanBoard
        benchLabel="BENCH"
        benchBadgeText="People"
        benchEmptyText="No applicants"
        assignmentLabel="ASSIGNMENTS"
        bench={[mockApplication]}
        isLoading={false}
        applications={[mockApplication]}
        assignments={{}}
        projects={[]}
        projectsLoading={false}
        selectedIds={new Set()}
        setSelectedIds={mockSetSelectedIds}
        handleDragStart={mockHandleDragStart}
        handleDragEnd={mockHandleDragEnd}
        handleUnassign={mockHandleUnassign}
        activeApplication={null}
        dragCount={0}
        onViewProfile={mockOnViewProfile}
        onAddProject={mockOnAddProject}
      />,
    );
    expect(screen.getByText(/1\s+People/)).toBeInTheDocument();
  });

  it("should show loading skeleton when isLoading is true", () => {
    render(
      <KanbanBoard
        benchLabel="BENCH"
        benchBadgeText="People"
        benchEmptyText="No applicants"
        assignmentLabel="ASSIGNMENTS"
        bench={[]}
        isLoading={true}
        applications={[]}
        assignments={{}}
        projects={[]}
        projectsLoading={false}
        selectedIds={new Set()}
        setSelectedIds={mockSetSelectedIds}
        handleDragStart={mockHandleDragStart}
        handleDragEnd={mockHandleDragEnd}
        handleUnassign={mockHandleUnassign}
        activeApplication={null}
        dragCount={0}
        onViewProfile={mockOnViewProfile}
        onAddProject={mockOnAddProject}
      />,
    );
    expect(screen.getByText("BENCH")).toBeInTheDocument();
  });

  it("should show empty bench text when bench is empty and not loading", () => {
    render(
      <KanbanBoard
        benchLabel="BENCH"
        benchBadgeText="People"
        benchEmptyText="No applicants on bench"
        assignmentLabel="ASSIGNMENTS"
        bench={[]}
        isLoading={false}
        applications={[]}
        assignments={{}}
        projects={[]}
        projectsLoading={false}
        selectedIds={new Set()}
        setSelectedIds={mockSetSelectedIds}
        handleDragStart={mockHandleDragStart}
        handleDragEnd={mockHandleDragEnd}
        handleUnassign={mockHandleUnassign}
        activeApplication={null}
        dragCount={0}
        onViewProfile={mockOnViewProfile}
        onAddProject={mockOnAddProject}
      />,
    );
    expect(screen.getByText("No applicants on bench")).toBeInTheDocument();
  });

  it("should render bench cards for each application", () => {
    const app2 = {
      ...mockApplication,
      id: "2",
      fullName: "Another User",
    };
    render(
      <KanbanBoard
        benchLabel="BENCH"
        benchBadgeText="People"
        benchEmptyText="No applicants"
        assignmentLabel="ASSIGNMENTS"
        bench={[mockApplication, app2]}
        isLoading={false}
        applications={[mockApplication, app2]}
        assignments={{}}
        projects={[]}
        projectsLoading={false}
        selectedIds={new Set()}
        setSelectedIds={mockSetSelectedIds}
        handleDragStart={mockHandleDragStart}
        handleDragEnd={mockHandleDragEnd}
        handleUnassign={mockHandleUnassign}
        activeApplication={null}
        dragCount={0}
        onViewProfile={mockOnViewProfile}
        onAddProject={mockOnAddProject}
      />,
    );
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Another User")).toBeInTheDocument();
  });

  it("should render add project button", () => {
    render(
      <KanbanBoard
        benchLabel="BENCH"
        benchBadgeText="People"
        benchEmptyText="No applicants"
        assignmentLabel="ASSIGNMENTS"
        bench={[]}
        isLoading={false}
        applications={[]}
        assignments={{}}
        projects={[]}
        projectsLoading={false}
        selectedIds={new Set()}
        setSelectedIds={mockSetSelectedIds}
        handleDragStart={mockHandleDragStart}
        handleDragEnd={mockHandleDragEnd}
        handleUnassign={mockHandleUnassign}
        activeApplication={null}
        dragCount={0}
        onViewProfile={mockOnViewProfile}
        onAddProject={mockOnAddProject}
      />,
    );
    const addButton = screen.getByRole("button");
    expect(addButton).toBeInTheDocument();
  });

  it("should call onAddProject when add project button is clicked", () => {
    render(
      <KanbanBoard
        benchLabel="BENCH"
        benchBadgeText="People"
        benchEmptyText="No applicants"
        assignmentLabel="ASSIGNMENTS"
        bench={[]}
        isLoading={false}
        applications={[]}
        assignments={{}}
        projects={[]}
        projectsLoading={false}
        selectedIds={new Set()}
        setSelectedIds={mockSetSelectedIds}
        handleDragStart={mockHandleDragStart}
        handleDragEnd={mockHandleDragEnd}
        handleUnassign={mockHandleUnassign}
        activeApplication={null}
        dragCount={0}
        onViewProfile={mockOnViewProfile}
        onAddProject={mockOnAddProject}
      />,
    );
    const addButton = screen.getByRole("button");
    fireEvent.click(addButton);
    expect(mockOnAddProject).toHaveBeenCalled();
  });

  it("should show loading projects message when projectsLoading is true", () => {
    render(
      <KanbanBoard
        benchLabel="BENCH"
        benchBadgeText="People"
        benchEmptyText="No applicants"
        assignmentLabel="ASSIGNMENTS"
        bench={[]}
        isLoading={false}
        applications={[]}
        assignments={{}}
        projects={[]}
        projectsLoading={true}
        selectedIds={new Set()}
        setSelectedIds={mockSetSelectedIds}
        handleDragStart={mockHandleDragStart}
        handleDragEnd={mockHandleDragEnd}
        handleUnassign={mockHandleUnassign}
        activeApplication={null}
        dragCount={0}
        onViewProfile={mockOnViewProfile}
        onAddProject={mockOnAddProject}
      />,
    );
    expect(screen.getByText("Loading projects...")).toBeInTheDocument();
  });

  it("should show no projects message when projects array is empty", () => {
    render(
      <KanbanBoard
        benchLabel="BENCH"
        benchBadgeText="People"
        benchEmptyText="No applicants"
        assignmentLabel="ASSIGNMENTS"
        bench={[]}
        isLoading={false}
        applications={[]}
        assignments={{}}
        projects={[]}
        projectsLoading={false}
        selectedIds={new Set()}
        setSelectedIds={mockSetSelectedIds}
        handleDragStart={mockHandleDragStart}
        handleDragEnd={mockHandleDragEnd}
        handleUnassign={mockHandleUnassign}
        activeApplication={null}
        dragCount={0}
        onViewProfile={mockOnViewProfile}
        onAddProject={mockOnAddProject}
      />,
    );
    expect(screen.getByText("No projects found. Create a project first.")).toBeInTheDocument();
  });

  it("should render projects grid with project cards", () => {
    render(
      <KanbanBoard
        benchLabel="BENCH"
        benchBadgeText="People"
        benchEmptyText="No applicants"
        assignmentLabel="ASSIGNMENTS"
        bench={[]}
        isLoading={false}
        applications={[mockApplication]}
        assignments={{}}
        projects={[mockProject]}
        projectsLoading={false}
        selectedIds={new Set()}
        setSelectedIds={mockSetSelectedIds}
        handleDragStart={mockHandleDragStart}
        handleDragEnd={mockHandleDragEnd}
        handleUnassign={mockHandleUnassign}
        activeApplication={null}
        dragCount={0}
        onViewProfile={mockOnViewProfile}
        onAddProject={mockOnAddProject}
      />,
    );
    expect(screen.getByText("Project 1")).toBeInTheDocument();
  });

  it("should have white background and rounded styling", () => {
    const { container } = render(
      <KanbanBoard
        benchLabel="BENCH"
        benchBadgeText="People"
        benchEmptyText="No applicants"
        assignmentLabel="ASSIGNMENTS"
        bench={[]}
        isLoading={false}
        applications={[]}
        assignments={{}}
        projects={[]}
        projectsLoading={false}
        selectedIds={new Set()}
        setSelectedIds={mockSetSelectedIds}
        handleDragStart={mockHandleDragStart}
        handleDragEnd={mockHandleDragEnd}
        handleUnassign={mockHandleUnassign}
        activeApplication={null}
        dragCount={0}
        onViewProfile={mockOnViewProfile}
        onAddProject={mockOnAddProject}
      />,
    );
    const mainContainer = container.querySelector(".bg-white");
    expect(mainContainer).toBeInTheDocument();
  });

  it("should render drag overlay when activeApplication is provided", () => {
    render(
      <KanbanBoard
        benchLabel="BENCH"
        benchBadgeText="People"
        benchEmptyText="No applicants"
        assignmentLabel="ASSIGNMENTS"
        bench={[]}
        isLoading={false}
        applications={[mockApplication]}
        assignments={{}}
        projects={[]}
        projectsLoading={false}
        selectedIds={new Set()}
        setSelectedIds={mockSetSelectedIds}
        handleDragStart={mockHandleDragStart}
        handleDragEnd={mockHandleDragEnd}
        handleUnassign={mockHandleUnassign}
        activeApplication={mockApplication}
        dragCount={1}
        onViewProfile={mockOnViewProfile}
        onAddProject={mockOnAddProject}
      />,
    );
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });
});
