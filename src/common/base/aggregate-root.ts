import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from 'typeorm'
import { EntityId } from './types'

@Entity()
export abstract class AggregateRoot {
    @PrimaryGeneratedColumn('uuid')
    id: EntityId

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @VersionColumn()
    version: number
}
