import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import UsersPage from "@/app/admin/users/page";
import { useUsersAdmin } from "@/components/admin/users";
import {
  ConfirmDeleteDialog,
  PageHeader,
} from "@/components/admin";
import {
  ChangeStatusDialog,
  UsersFilters,
  UsersTable,
  ViewUserDialog,
} from "@/components/admin/users";

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@/components/admin", () => ({
  AdminPageLayout: ({ children }: { children: React.ReactNode }) => (
    <section>{children}</section>
  ),
  ConfirmDeleteDialog: jest.fn(
    ({ title, description }: { title: string; description: string }) => (
      <div>{`${title} ${description}`}</div>
    ),
  ),
  PageHeader: jest.fn(({ title, subtitle }: { title: string; subtitle: string }) => (
    <header>{`${title} ${subtitle}`}</header>
  )),
}));

jest.mock("@/components/admin/users", () => ({
  useUsersAdmin: jest.fn(),
  UsersFilters: jest.fn(() => <div>UsersFilters</div>),
  UsersTable: jest.fn(() => <div>UsersTable</div>),
  ViewUserDialog: jest.fn(() => <div>ViewUserDialog</div>),
  ChangeStatusDialog: jest.fn(() => <div>ChangeStatusDialog</div>),
}));

describe("UsersPage component", () => {
  const setRoleFilter = jest.fn();
  const setStatusFilter = jest.fn();
  const setSearch = jest.fn();
  const setPage = jest.fn();

  const setViewUser = jest.fn();
  const setDeleteUserId = jest.fn();
  const setStatusUser = jest.fn();
  const setPendingStatus = jest.fn();

  const openStatusDialog = jest.fn();
  const handleChangeStatus = jest.fn();
  const handleDeleteUser = jest.fn();

  const hookData = {
    constants: {
      ITEMS_PER_PAGE: 10,
    },
    filters: {
      roleFilter: "all",
      statusFilter: "all",
      search: "",
      setRoleFilter,
      setStatusFilter,
      setSearch,
      setPage,
    },
    table: {
      visibleUsers: [],
      isLoading: false,
      fetchError: null,
      safePage: 2,
      totalPages: 5,
      totalUsers: 42,
    },
    dialogs: {
      viewUser: null,
      setViewUser,
      statusUser: null,
      setStatusUser,
      pendingStatus: "Active",
      setPendingStatus,
      deleteUserId: "user-123",
      setDeleteUserId,
      isMutating: false,
    },
    actions: {
      openStatusDialog,
      handleChangeStatus,
      handleDeleteUser,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useUsersAdmin as jest.Mock).mockReturnValue(hookData);
  });

  it("renders users page and forwards expected props", () => {
    const html = renderToStaticMarkup(<UsersPage />);

    expect(html).toContain("UsersFilters");
    expect(html).toContain("UsersTable");
    expect(html).toContain("ViewUserDialog");
    expect(html).toContain("ChangeStatusDialog");

    expect(PageHeader).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "User Administration",
      }),
      {},
    );

    expect(UsersFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        roleFilter: "all",
        statusFilter: "all",
        search: "",
      }),
      {},
    );

    expect(UsersTable).toHaveBeenCalledWith(
      expect.objectContaining({
        users: [],
        isLoading: false,
        fetchError: null,
        page: 2,
        totalPages: 5,
        totalUsers: 42,
        itemsPerPage: 10,
      }),
      {},
    );

    expect(ConfirmDeleteDialog).toHaveBeenCalledWith(
      expect.objectContaining({
        open: true,
        title: "Delete User",
        isPending: false,
      }),
      {},
    );
  });

  it("resets page to 1 when filters change", () => {
    renderToStaticMarkup(<UsersPage />);

    const filtersProps = (UsersFilters as jest.Mock).mock.calls[0][0];

    filtersProps.onRoleChange("Student");
    filtersProps.onStatusChange("Active");
    filtersProps.onSearchChange("alice");

    expect(setRoleFilter).toHaveBeenCalledWith("Student");
    expect(setStatusFilter).toHaveBeenCalledWith("Active");
    expect(setSearch).toHaveBeenCalledWith("alice");
    expect(setPage).toHaveBeenCalledTimes(3);
    expect(setPage).toHaveBeenNthCalledWith(1, 1);
    expect(setPage).toHaveBeenNthCalledWith(2, 1);
    expect(setPage).toHaveBeenNthCalledWith(3, 1);
  });

  it("closes dialogs when open state changes to false", () => {
    renderToStaticMarkup(<UsersPage />);

    const viewDialogProps = (ViewUserDialog as jest.Mock).mock.calls[0][0];
    const statusDialogProps = (ChangeStatusDialog as jest.Mock).mock.calls[0][0];
    const deleteDialogProps = (ConfirmDeleteDialog as jest.Mock).mock.calls[0][0];

    viewDialogProps.onOpenChange(false);
    statusDialogProps.onOpenChange(false);
    deleteDialogProps.onOpenChange(false);

    expect(setViewUser).toHaveBeenCalledWith(null);
    expect(setStatusUser).toHaveBeenCalledWith(null);
    expect(setDeleteUserId).toHaveBeenCalledWith(null);
  });
});
