import { Exclude } from 'class-transformer'
import { Column, Entity } from 'typeorm'
import { AggregateRoot } from 'src/common/base'

@Entity()
export class User extends AggregateRoot {
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
