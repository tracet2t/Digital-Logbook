import { MoreVertical } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";

import StatusBadge from "./StatusBadge";

export interface InvitationRow {
  id: string;
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
    <div className="overflow-hidden rounded-lg border border-[#e4e7ed]">
      <Table>
        <TableHeader>
          <TableRow className="border-[#e4e7ed] bg-slate-50">
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Email
            </TableHead>
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Role
            </TableHead>
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Project
            </TableHead>
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-8 text-center text-slate-400"
              >
                Loading...
              </TableCell>
            </TableRow>
          )}
          {error && (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-red-500">
                Failed to load invitations
              </TableCell>
            </TableRow>
          )}
          {!loading && !error && data.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-8 text-center text-slate-400"
              >
                No invitations found.
              </TableCell>
            </TableRow>
          )}
          {!loading &&
            data.map((inv) => (
              <TableRow
                key={inv.id}
                className="border-[#e4e7ed] hover:bg-slate-50/50 transition-colors"
              >
                <TableCell className="font-medium text-slate-900">
                  {inv.email}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                      inv.role === "mentor" || inv.role === "superAdmin"
                        ? "bg-[#18181B] text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {inv.role}
                  </span>
                </TableCell>
                <TableCell className="text-slate-600">{inv.project}</TableCell>
                <TableCell>
                  <StatusBadge status={inv.status} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="h-8 w-8 inline-flex items-center justify-center rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                        <MoreVertical size={15} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onSelect={() => onView(inv)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => onChangeStatus(inv)}>
                        Change Status
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        onSelect={() => onDelete(inv.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
