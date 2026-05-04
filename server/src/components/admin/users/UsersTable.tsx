import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AdminPagination,
  AdminStatusBadge,
  RoleBadge,
  TableActionMenu,
  TableStateRows,
} from "@/components/admin";
import { MenteeAvatar } from "@/components/mentor/MenteeAvatar";

import { UserRecord } from "./types";
import { getInitials } from "./utils";

interface UsersTableProps {
  users: UserRecord[];
  isLoading: boolean;
  fetchError: string | null;
  page: number;
  totalPages: number;
  totalUsers: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onViewUser: (user: UserRecord) => void;
  onChangeStatus: (user: UserRecord) => void;
  onDeleteUser: (id: string) => void;
}

export default function UsersTable({
  users,
  isLoading,
  fetchError,
  page,
  totalPages,
  totalUsers,
  itemsPerPage,
  onPageChange,
  onViewUser,
  onChangeStatus,
  onDeleteUser,
}: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#e4e7ed]">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
            <TableHead className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              User Identity
            </TableHead>
            <TableHead className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Batch
            </TableHead>
            <TableHead className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Role
            </TableHead>
            <TableHead className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Status
            </TableHead>
            <TableHead className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Created Date
            </TableHead>
            <TableHead className="px-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableStateRows
            colSpan={6}
            loading={isLoading}
            error={fetchError}
            empty={!isLoading && !fetchError && users.length === 0}
            loadingMessage="Loading users..."
            emptyMessage="No users found for the selected filters."
          />
          {!isLoading &&
            !fetchError &&
            users.map((user) => (
              <TableRow key={user.id} className="bg-white hover:bg-[#fbfcff]">
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {user.role === "Student" ? (
                      <MenteeAvatar
                        studentId={user.id}
                        name={user.name}
                        initials={getInitials(user.name)}
                        className="h-9 w-9 border border-slate-200"
                      />
                    ) : (
                      <Avatar className="h-9 w-9 border border-slate-200">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.name} />
                        ) : null}
                        <AvatarFallback className="bg-[#000053] text-xs font-semibold text-white">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-3">
                  {user.batchNo ? (
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-600">
                      {user.batchNo}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </TableCell>

                <TableCell className="px-4 py-3">
                  <RoleBadge role={user.role} />
                </TableCell>

                <TableCell className="px-4 py-3">
                  <AdminStatusBadge status={user.status} />
                </TableCell>

                <TableCell className="px-4 py-3 text-sm text-slate-700">
                  {user.createdAt}
                </TableCell>

                <TableCell className="px-4 py-3 text-right">
                  <TableActionMenu
                    ariaLabel={`Actions for ${user.name}`}
                    items={[
                      {
                        label: "View Details",
                        onSelect: () => onViewUser(user),
                      },
                      {
                        label: "Change Status",
                        onSelect: () => onChangeStatus(user),
                      },
                      {
                        label: "Delete User",
                        variant: "danger",
                        separator: true,
                        onSelect: () => onDeleteUser(user.id),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <AdminPagination
        page={page}
        totalPages={totalPages}
        total={totalUsers}
        itemsPerPage={itemsPerPage}
        itemLabel="users"
        onPageChange={onPageChange}
      />
    </div>
  );
}
