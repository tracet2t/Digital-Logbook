export type UserRole = "Student" | "Mentor" | "SuperAdmin";
export type UserStatus = "Active" | "Inactive";

export type ApiUserRole = "student" | "mentor" | "superAdmin";

export interface ApiUserRecord {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: ApiUserRole;
  isActive: boolean;
  createdAt: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  avatar?: string;
}
