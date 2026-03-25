export type RoleValue =
  | "student"
  | "mentor"
  | "superAdmin"
  | "Student"
  | "Mentor"
  | "SuperAdmin";

interface RoleBadgeProps {
  role: RoleValue | string;
}

const styles: Record<string, string> = {
  student: "bg-slate-100 text-slate-700 border-slate-200",
  Student: "bg-slate-100 text-slate-700 border-slate-200",
  mentor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Mentor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  superAdmin: "bg-indigo-50 text-indigo-700 border-indigo-200",
  SuperAdmin: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

const labels: Record<string, string> = {
  student: "Mentee",
  Student: "Mentee",
  mentor: "Mentor",
  Mentor: "Mentor",
  superAdmin: "Super Admin",
  SuperAdmin: "Super Admin",
};

/**
 * Colored pill badge for user roles (Mentee / Mentor / SuperAdmin).
 * Accepts both camelCase API values ("student", "superAdmin") and
 * display-case values ("Student", "SuperAdmin").
 *
 * Usage:
 *   <RoleBadge role={user.role} />
 *   <RoleBadge role="superAdmin" />
 */
export default function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold ${
        styles[role] ?? "bg-slate-100 text-slate-700 border-slate-200"
      }`}
    >
      {labels[role] ?? role}
    </span>
  );
}
