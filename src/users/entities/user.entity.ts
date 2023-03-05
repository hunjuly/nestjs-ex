import { Exclude } from 'class-transformer'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { EntityId } from 'src/common/base'

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: EntityId

    @Column({ unique: true })
    email: string

    @Column()
    @Exclude()
    password: string

    @Column({ type: 'datetime' })
    birthdate: Date

    @Column()
    username: string

    @Column()
    firstName: string

    @Column()
    lastName: string
}
