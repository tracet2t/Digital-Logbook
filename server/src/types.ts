type Role = 'student' | 'mentor' | 'admin'
type UserState = {
    username: string
    firstname: string
    lastname: string
    role: Role
}

export type { Role, UserState }