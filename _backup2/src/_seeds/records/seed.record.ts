import { Column, Entity } from 'typeorm'
import { BaseRecord } from 'src//common/application'

@Entity('Seeds')
export class SeedRecord extends BaseRecord {
    @Column({ unique: true })
    name: string
}
