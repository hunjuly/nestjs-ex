import { Column, Entity, OneToMany } from 'typeorm'
import { AggregateRoot } from 'src/common/base'
import { Seat } from './seat.entity'

@Entity()
export class Theater extends AggregateRoot {
    @Column()
    name: string

    @Column()
    address: string

    @Column('double', { nullable: true })
    latitude: number

    @Column('double', { nullable: true })
    longitude: number

    @OneToMany(() => Seat, (seat) => seat.theater)
    seats: Seat[]
}
