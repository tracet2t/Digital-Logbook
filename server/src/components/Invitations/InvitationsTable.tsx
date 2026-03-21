import { MoreVertical } from "lucide-react";

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
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/95">
            <tr>
              <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-8 text-center text-slate-400"
                >
                  Loading...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-red-500">
                  Failed to load invitations
                </td>
              </tr>
            )}
            {!loading && !error && data.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-8 text-center text-slate-400"
                >
                  No invitations found.
                </td>
              </tr>
            )}
            {!loading &&
              data.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {inv.email}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${inv.role === "mentor" || inv.role === "superAdmin" ? "bg-[#18181B] text-white" : "bg-slate-100 text-slate-600"}`}
                    >
                      {inv.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{inv.project}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
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
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
