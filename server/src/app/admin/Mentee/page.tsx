"use client";

import { useEffect } from "react";

import {
  AdminPageLayout,
  ConfirmDeleteDialog,
  FilterBar,
  PageHeader,
} from "@/components/admin";
import { Card } from "@/components/ui/card";
import {
  ChangeStatusDialog,
  UsersTable,
  ViewUserDialog,
  useUsersAdmin,
} from "@/components/admin/users";

export default function MenteesPage() {
  const { constants, filters, table, dialogs, actions } = useUsersAdmin();
  const { roleFilter, setRoleFilter, setPage, search, setSearch } = filters;

  useEffect(() => {
    if (roleFilter !== "Student") {
      setRoleFilter("Student");
      setPage(1);
    }
  }, [roleFilter, setRoleFilter, setPage]);

  return (
    <>
      <AdminPageLayout>
        <div className="flex-1 p-5 md:p-8">
          <Card className="overflow-hidden border-[#d9dde5] bg-white">
            <div className="space-y-4 p-4 md:p-5">
              <PageHeader
                title="All Mentees"
                subtitle="Manage mentee accounts and monitor their status."
              />

              <FilterBar>
                <FilterBar.Field label="Role">
                  <div className="inline-flex h-8 items-center rounded-md border border-[#dbe0e8] bg-slate-100 px-3 text-xs font-semibold text-slate-600">
                    Student (Mentee)
                  </div>
                </FilterBar.Field>

                <FilterBar.Search
                  value={search}
                  onChange={(value) => {
                    setSearch(value);
                    setPage(1);
                  }}
                  placeholder="Search mentee by name, email, or ID..."
                />
              </FilterBar>

              <UsersTable
                users={table.visibleUsers}
                isLoading={table.isLoading}
                fetchError={table.fetchError}
                page={table.safePage}
                totalPages={table.totalPages}
                totalUsers={table.totalUsers}
                itemsPerPage={constants.ITEMS_PER_PAGE}
                onPageChange={setPage}
                onViewUser={dialogs.setViewUser}
                onChangeStatus={actions.openStatusDialog}
                onDeleteUser={dialogs.setDeleteUserId}
              />
            </div>
          </Card>
        </div>
      </AdminPageLayout>

      <ViewUserDialog
        user={dialogs.viewUser}
        onOpenChange={(open) => !open && dialogs.setViewUser(null)}
      />

      <ChangeStatusDialog
        user={dialogs.statusUser}
        pendingStatus={dialogs.pendingStatus}
        isMutating={dialogs.isMutating}
        onPendingStatusChange={dialogs.setPendingStatus}
        onOpenChange={(open) => !open && dialogs.setStatusUser(null)}
        onSave={actions.handleChangeStatus}
      />

      <ConfirmDeleteDialog
        open={!!dialogs.deleteUserId}
        onOpenChange={(open) => !open && dialogs.setDeleteUserId(null)}
        onConfirm={actions.handleDeleteUser}
        isPending={dialogs.isMutating}
        title="Delete Mentee"
        description="This will permanently delete the mentee account and associated records. This action cannot be undone."
      />
    </>
  );
}