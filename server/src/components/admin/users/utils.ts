import { ApiUserRecord, ApiUserRole, UserRecord, UserRole } from "./types";

export function toUserRole(role: ApiUserRole): UserRole {
  if (role === "student") {
    return "Student";
  }
  if (role === "mentor") {
    return "Mentor";
  }
  return "SuperAdmin";
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function mapApiUserToRecord(user: ApiUserRecord): UserRecord {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    role: toUserRole(user.role),
    status: user.isActive ? "Active" : "Inactive",
    batchNo: user.batchNo ?? null,
    createdAt: formatDate(user.createdAt),
  };
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
