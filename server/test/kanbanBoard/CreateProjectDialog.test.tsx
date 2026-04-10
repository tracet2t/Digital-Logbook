import { render, screen, fireEvent } from "@testing-library/react";
import { CreateProjectDialog } from "@/components/admin/kanban";

describe("CreateProjectDialog", () => {
  const mockOnOpenChange = jest.fn();
  const mockOnFormChange = jest.fn();
  const mockOnSubmit = jest.fn();

  const defaultForm = {
    name: "",
    description: "",
    domain: "",
    batchNo: "",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render dialog title", () => {
    render(
      <CreateProjectDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        form={defaultForm}
        onFormChange={mockOnFormChange}
        onSubmit={mockOnSubmit}
        isPending={false}
      />,
    );
    expect(screen.getByText("Create New Project")).toBeInTheDocument();
  });

  it("should render project name label", () => {
    render(
      <CreateProjectDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        form={defaultForm}
        onFormChange={mockOnFormChange}
        onSubmit={mockOnSubmit}
        isPending={false}
      />,
    );
    expect(screen.getByText("Project Name")).toBeInTheDocument();
  });

  it("should render description label", () => {
    render(
      <CreateProjectDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        form={defaultForm}
        onFormChange={mockOnFormChange}
        onSubmit={mockOnSubmit}
        isPending={false}
      />,
    );
    expect(screen.getByText("Description (optional)")).toBeInTheDocument();
  });

  it("should render domain label", () => {
    render(
      <CreateProjectDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        form={defaultForm}
        onFormChange={mockOnFormChange}
        onSubmit={mockOnSubmit}
        isPending={false}
      />,
    );
    expect(screen.getByText("Domain")).toBeInTheDocument();
  });

  it("should render batch no label", () => {
    render(
      <CreateProjectDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        form={defaultForm}
        onFormChange={mockOnFormChange}
        onSubmit={mockOnSubmit}
        isPending={false}
      />,
    );
    expect(screen.getByText("Batch No (optional)")).toBeInTheDocument();
  });

  it("should render input fields", () => {
    render(
      <CreateProjectDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        form={defaultForm}
        onFormChange={mockOnFormChange}
        onSubmit={mockOnSubmit}
        isPending={false}
      />,
    );
    expect(screen.getByText("Project Name")).toBeInTheDocument();
  });

  it("should render textarea for description", () => {
    render(
      <CreateProjectDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        form={defaultForm}
        onFormChange={mockOnFormChange}
        onSubmit={mockOnSubmit}
        isPending={false}
      />,
    );
    expect(screen.getByText("Description (optional)")).toBeInTheDocument();
  });

  it("should render domain select dropdown", () => {
    render(
      <CreateProjectDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        form={defaultForm}
        onFormChange={mockOnFormChange}
        onSubmit={mockOnSubmit}
        isPending={false}
      />,
    );
    const selectTrigger = screen.getByRole("combobox");
    expect(selectTrigger).toBeInTheDocument();
  });

  it("should render cancel button", () => {
    render(
      <CreateProjectDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        form={defaultForm}
        onFormChange={mockOnFormChange}
        onSubmit={mockOnSubmit}
        isPending={false}
      />,
    );
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    expect(cancelButton).toBeInTheDocument();
  });

  it("should render create project button", () => {
    render(
      <CreateProjectDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        form={defaultForm}
        onFormChange={mockOnFormChange}
        onSubmit={mockOnSubmit}
        isPending={false}
      />,
    );
    expect(screen.getByRole("button", { name: /Create Project/i })).toBeInTheDocument();
  });

  it("should disable create button when name is empty", () => {
    render(
      <CreateProjectDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        form={defaultForm}
        onFormChange={mockOnFormChange}
        onSubmit={mockOnSubmit}
        isPending={false}
      />,
    );
    const createButton = screen.getByRole("button", { name: /Create Project/i });
    expect(createButton).toBeDisabled();
  });

  it("should enable create button when name has value", () => {
    render(
      <CreateProjectDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        form={{ ...defaultForm, name: "New Project" }}
        onFormChange={mockOnFormChange}
        onSubmit={mockOnSubmit}
        isPending={false}
      />,
    );
    const createButton = screen.getByRole("button", { name: /Create Project/i });
    expect(createButton).not.toBeDisabled();
  });

  it("should disable buttons when isPending is true", () => {
    render(
      <CreateProjectDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        form={{ ...defaultForm, name: "Project" }}
        onFormChange={mockOnFormChange}
        onSubmit={mockOnSubmit}
        isPending={true}
      />,
    );
    const createButton = screen.getByRole("button", { name: /Creating/i });
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    expect(createButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it("should show creating text when isPending is true", () => {
    render(
      <CreateProjectDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        form={{ ...defaultForm, name: "Project" }}
        onFormChange={mockOnFormChange}
        onSubmit={mockOnSubmit}
        isPending={true}
      />,
    );
    expect(screen.getByText("Creating…")).toBeInTheDocument();
  });

  it("should call onSubmit when create button is clicked", () => {
    render(
      <CreateProjectDialog
        open={true}
        onOpenChange={mockOnOpenChange}
        form={{ ...defaultForm, name: "New Project" }}
        onFormChange={mockOnFormChange}
        onSubmit={mockOnSubmit}
        isPending={false}
      />,
    );
    const createButton = screen.getByRole("button", { name: /Create Project/i });
    fireEvent.click(createButton);
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("should not render when open is false", () => {
    render(
      <CreateProjectDialog
        open={false}
        onOpenChange={mockOnOpenChange}
        form={defaultForm}
        onFormChange={mockOnFormChange}
        onSubmit={mockOnSubmit}
        isPending={false}
      />,
    );
    expect(screen.queryByText("Create New Project")).not.toBeInTheDocument();
  });
});
