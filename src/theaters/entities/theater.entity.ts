import { Column, Entity } from 'typeorm'
import { AggregateRoot } from 'src/common/base'

@Entity()
export class Theater extends AggregateRoot {
    @Column()
    name: string
}
