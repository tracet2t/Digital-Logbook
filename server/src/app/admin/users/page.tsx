"use client";

import { Card } from "@/components/ui/card";
import {
  AdminPageLayout,
  ConfirmDeleteDialog,
  PageHeader,
} from "@/components/admin";
import {
  ChangeStatusDialog,
  UsersFilters,
  UsersTable,
  ViewUserDialog,
  useUsersAdmin,
} from "@/components/admin/users";

export default function UsersPage() {
  const { constants, filters, table, dialogs, actions } = useUsersAdmin();

  return (
    <>
      <AdminPageLayout>
        <div className="flex-1 p-5 md:p-8">
          <Card className="overflow-hidden border-[#d9dde5] bg-white">
            <div className="space-y-4 p-4 md:p-5">
              <PageHeader
                title="User Administration"
                subtitle="Manage system users, define their platform roles, and monitor account statuses."
              />

              <UsersFilters
                roleFilter={filters.roleFilter}
                statusFilter={filters.statusFilter}
                search={filters.search}
                onRoleChange={(value) => {
                  filters.setRoleFilter(value);
                  filters.setPage(1);
                }}
                onStatusChange={(value) => {
                  filters.setStatusFilter(value);
                  filters.setPage(1);
                }}
                onSearchChange={(value) => {
                  filters.setSearch(value);
                  filters.setPage(1);
                }}
              />

              <UsersTable
                users={table.visibleUsers}
                isLoading={table.isLoading}
                fetchError={table.fetchError}
                page={table.safePage}
                totalPages={table.totalPages}
                totalUsers={table.totalUsers}
                itemsPerPage={constants.ITEMS_PER_PAGE}
                onPageChange={filters.setPage}
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
        title="Delete User"
        description="This will permanently delete the user account and all associated data — including activities, feedback, reports, badges, and project allocations. This action cannot be undone."
      />
    </>
  );
}
