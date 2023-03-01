import { Exclude } from 'class-transformer'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    @Exclude()
    password: string

    @Column({ type: 'date', nullable: true })
    birthdate: Date

    @Column({ nullable: true })
    username: string

    @Column({ nullable: true })
    firstName: string

    @Column({ nullable: true })
    lastName: string
}
