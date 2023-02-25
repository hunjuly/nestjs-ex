import { UserRole } from 'src/users/domain'

export interface LoginPayload {
    userId: string
    email: string
    role: UserRole
}
