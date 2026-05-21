"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import RoleBadge from "@/components/admin/RoleBadge";
import TableActionMenu from "@/components/admin/TableActionMenu";
import TableStateRows from "@/components/admin/TableStateRows";

export interface InvitationRow {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  role: string;
  project: string;
  status: "Pending" | "Accepted" | "Expired";
  createdAt: string;
  expiresAt: string;
}

interface InvitationsTableProps {
  data: InvitationRow[];
  loading: boolean;
  error: boolean;
  onView: (inv: InvitationRow) => void;
  onChangeStatus: (inv: InvitationRow) => void;
  onDelete: (id: string) => void;
}

export default function InvitationsTable({
  data,
  loading,
  error,
  onView,
  onChangeStatus,
  onDelete,
}: InvitationsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
          <TableHead className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Name / Email
          </TableHead>
          <TableHead className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Role
          </TableHead>
          <TableHead className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Project
          </TableHead>
          <TableHead className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Status
          </TableHead>
          <TableHead className="px-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableStateRows
          colSpan={5}
          loading={loading}
          error={error}
          empty={!loading && !error && data.length === 0}
          loadingMessage="Loading invitations..."
          emptyMessage="No invitations found."
        />
        {!loading &&
          !error &&
          data.map((inv) => {
            const displayName = `${inv.firstName ?? ""} ${inv.lastName ?? ""}`
              .trim()
              .replace(/\s+/g, " ");
            const nameToShow = displayName.length > 0 ? displayName : "—";

            return (
              <TableRow key={inv.id} className="bg-white hover:bg-[#fbfcff]">
                <TableCell className="px-4 py-3 font-medium text-slate-900">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-slate-900">
                      {nameToShow}
                    </p>
                    <p className="text-xs font-normal text-slate-500">
                      {inv.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <RoleBadge role={inv.role} />
                </TableCell>
                <TableCell className="px-4 py-3 text-slate-500">
                  {inv.project}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <AdminStatusBadge status={inv.status} />
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <TableActionMenu
                    ariaLabel={`Actions for ${inv.email}`}
                    items={[
                      { label: "View Details", onSelect: () => onView(inv) },
                      {
                        label: "Change Status",
                        onSelect: () => onChangeStatus(inv),
                      },
                      {
                        label: "Delete",
                        onSelect: () => onDelete(inv.id),
                        variant: "danger",
                        separator: true,
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
