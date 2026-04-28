/**
 * Unified status badge that covers all admin status types in one component,
 * replacing the two separate StatusBadge files that existed in
 * admin-dashboard/ and Invitations/.
 *
 * Supported status values:
 *   Invitation:  "Pending" | "Accepted" | "Expired"
 *   User:        "Active"  | "Inactive"
 *   Project:     "active"  | "pending"  | "delayed"
 *
 * Usage:
 *   <AdminStatusBadge status={inv.status} />
 *   <AdminStatusBadge status={user.status} />
 *   <AdminStatusBadge status={project.status} />
 */

export type StatusValue =
  | "Pending"
  | "Accepted"
  | "Expired"
  | "Active"
  | "Inactive"
  | "active"
  | "pending"
  | "approved"
  | "rejected"
  | "delayed";

interface AdminStatusBadgeProps {
  status: StatusValue | string;
}

const config: Record<
  string,
  { bg: string; text: string; border: string; dot?: string; label: string }
> = {
  Pending: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200/60",
    dot: "bg-amber-500",
    label: "Pending",
  },
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-100",
    label: "Pending",
  },
  approved: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-100",
    label: "Approved",
  },
  rejected: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-100",
    label: "Rejected",
  },
  Accepted: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200/60",
    dot: "bg-emerald-500",
    label: "Active",
  },
  active: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-100",
    label: "Active",
  },
  Active: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200/60",
    dot: "bg-blue-500",
    label: "Active",
  },
  Inactive: {
    bg: "bg-slate-50",
    text: "text-slate-500",
    border: "border-slate-200",
    dot: "bg-slate-400",
    label: "Inactive",
  },
  Expired: {
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-200/60",
    dot: "bg-rose-500",
    label: "Expired",
  },
  delayed: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-100",
    label: "Delayed",
  },
};

export default function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  const c = config[status] ?? {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}
    >
      {c.dot && <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />}
      {c.label}
    </span>
  );
}
