import { Column, Entity } from 'typeorm'
import { AggregateRoot } from 'src/common/base'

@Entity()
export class Order extends AggregateRoot {
    @Column()
    name: string
}
