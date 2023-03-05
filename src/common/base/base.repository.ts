import { DataSource, DeepPartial, FindOptionsWhere, ObjectLiteral, QueryRunner, Repository } from 'typeorm'
import { BaseEntity } from './base.entity'
import { FindOption, PaginatedResult } from './find-option'
import { EntityId } from './types'

export abstract class BaseRepository<Entity extends BaseEntity> {
    constructor(protected typeorm: Repository<Entity>, protected dataSource: DataSource) {}

    async startTransaction() {
        const queryRunner = this.dataSource.createQueryRunner()

        await queryRunner.connect()
        await queryRunner.startTransaction()

        return queryRunner
    }

    async commitTransaction(queryRunner: QueryRunner) {
        return queryRunner.commitTransaction()
    }

    async rollbackTransaction(queryRunner: QueryRunner) {
        return queryRunner.rollbackTransaction()
    }

    async create(newEntity: DeepPartial<Entity>, queryRunner?: QueryRunner): Promise<Entity> {
        const newEn = this.typeorm.create(newEntity)

        if (queryRunner) {
            return await queryRunner.manager.save(newEn)
        } else {
            return this.typeorm.save(newEn)
        }
    }

    async save(entity: Entity, queryRunner?: QueryRunner): Promise<Entity> {
        if (queryRunner) {
            return await queryRunner.manager.save(entity)
        } else {
            return this.typeorm.save(entity)
        }
    }

    async remove(entity: Entity, queryRunner?: QueryRunner): Promise<void> {
        if (queryRunner) {
            await queryRunner.manager.remove(entity)
        } else {
            await this.typeorm.remove(entity)
        }
    }

    async findById(id: EntityId): Promise<Entity> {
        return this.typeorm.findOneBy({ id } as FindOptionsWhere<Entity>)
    }

    async find(option: FindOption, search?: SearchOption): Promise<PaginatedResult<Entity>> {
        const qb = this.typeorm.createQueryBuilder('entity')

        const limit = option.limit ?? 100
        qb.limit(option.limit)

        const offset = option.offset ?? 0
        qb.offset(option.offset)

        if (option.order) {
            const order = option.order.direction.toLowerCase() === 'desc' ? 'DESC' : 'ASC'

            qb.orderBy(option.order.name, order)
        }

        if (search) {
            qb.where(search.where, search.params)
        }

        const [items, total] = await qb.getManyAndCount()

        return { items, total, offset, limit }
    }
}

interface SearchOption {
    where: string
    params: ObjectLiteral
}
