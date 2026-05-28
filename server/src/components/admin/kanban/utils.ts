import { InvitationStatus } from "@/_hooks/admin/useAdminOnboarding";

export function getInvitationStatusColor(
  status: InvitationStatus | undefined,
): string {
  if (!status) return "";

  switch (status) {
    case "Active":
      return "bg-emerald-500";
    case "Pending":
      return "bg-amber-500";
    case "Expired":
      return "bg-rose-500";
    default:
      return "bg-slate-400";
  }
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
