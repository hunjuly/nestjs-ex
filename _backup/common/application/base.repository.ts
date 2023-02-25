import { Repository } from 'typeorm'
import { Assert } from '../assert'
import { OrderOption } from './order-option'
import { PageOption, PaginatedResult } from './page-option'

export abstract class BaseRepository<Record, Entity> {
    // TODO any로 하면 안 되는데 방법을 몰랐다.
    constructor(protected typeorm: Repository<any>) {}

    // recordToEntity에서 record는 이미 완성된 데이터가 들어있는 것이기 때문에 Partial인 경우가 없다.
    // 그러나 entityToRecord에서 entity는 update나 create 할 때 id나 updateTime 등은 미정인 경우가 있다.
    protected abstract recordToEntity(record: Record): Entity
    protected abstract entityToRecord(entity: Partial<Entity>): Partial<Record>

    hasColumn(columnName: string) {
        for (const column of this.typeorm.metadata.columns) {
            if (column.databaseName === columnName) return true
        }

        return false
    }

    async findById(id: string): Promise<Entity | null> {
        const record = await this.typeorm.findOneBy({ id })

        if (record) return this.recordToEntity(record)

        return null
    }

    async create(entity: Partial<Entity>): Promise<Entity> {
        const record = this.entityToRecord(entity)

        const newRecord = await this.typeorm.save(record)

        return this.recordToEntity(newRecord)
    }

    async update(id: string, entity: Partial<Entity>): Promise<boolean> {
        const record = this.entityToRecord(entity)

        const result = await this.typeorm.update(id, record)

        Assert.unique(result, 'The update id cannot be duplicated.')

        return result.affected === 1
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.typeorm.delete(id)

        Assert.unique(result, 'The remove id cannot be duplicated.')

        return result.affected === 1
    }

    async find(page: PageOption, order: OrderOption): Promise<PaginatedResult<Entity>> {
        const repositoryOrder = order && { [order.name]: order.direction }

        const [records, total] = await this.typeorm.findAndCount({
            skip: page.offset,
            take: page.limit,
            order: repositoryOrder
        })

        const items: Entity[] = []

        records.forEach((record) => {
            const item = this.recordToEntity(record)

            items.push(item)
        })

        return { ...page, total, items }
    }

    async startTransaction() {
        this.typeorm.queryRunner.startTransaction()
    }

    async commitTransaction() {
        this.typeorm.queryRunner.commitTransaction()
    }

    async rollbackTransaction() {
        this.typeorm.queryRunner.rollbackTransaction()
    }
}
