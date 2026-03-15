type Role = "student" | "mentor" | "superAdmin";

type UserState = {
  id: string;
  email: string;
  role: Role;
  fname: string;
  lname: string;
};

export type { Role, UserState };
