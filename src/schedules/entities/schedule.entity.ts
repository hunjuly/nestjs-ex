import { Column, Entity } from 'typeorm'
import { AggregateRoot } from 'src/common/base'

@Entity()
export class Schedule extends AggregateRoot {
    @Column()
    name: string
}
