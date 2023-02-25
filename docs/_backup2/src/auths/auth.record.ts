import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { UserRole } from 'src/users/domain'

@Entity()
export class AuthRecord {
    @PrimaryColumn()
    userId: string

    @Column({ unique: true })
    email: string

    @Column()
    role: UserRole

    @Column()
    passwordHash: string

    @UpdateDateColumn()
    updateDate: Date
}

export const nullAuthRecord = new AuthRecord()
nullAuthRecord.userId = 'abcdef'
nullAuthRecord.email = 'user@mail.com'
nullAuthRecord.role = 'member'
nullAuthRecord.passwordHash = '123456abc'
nullAuthRecord.updateDate = new Date(0)
