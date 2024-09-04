type Role = 'student' | 'mentor' | 'admin';

type UserState = {
    id: string;
    email: string;
    role: Role;
};

export type { Role, UserState };
