import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from 'src/common/base'
import { Theater } from './theater.entity'

@Entity()
export class Seat extends BaseEntity {
    @Column()
    row: string

    @Column()
    column: number

    @ManyToOne(() => Theater, (theater) => theater.seats)
    theater: Theater
}
