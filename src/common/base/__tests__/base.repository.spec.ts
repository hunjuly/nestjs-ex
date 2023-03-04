import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FindOption } from '../find-option'
import { QueryDto, Sample, SampleRepository } from './sample.repository'

describe('BaseRepository', () => {
    let repository: SampleRepository

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    synchronize: true,
                    autoLoadEntities: true
                }),
                TypeOrmModule.forFeature([Sample])
            ],
            providers: [SampleRepository]
        }).compile()

        repository = module.get(SampleRepository)
    })

    describe('findAll', () => {
        beforeEach(async () => {
            for (let i = 0; i < 10; i++) {
                await repository.create({ name: `Seed#${i}` })
            }
        })

        it('returns all samples when there is no search query', async () => {
            const findOption: FindOption = {}
            const queryDto: QueryDto = {}
            const result = await repository.findAll(findOption, queryDto)
            expect(result.items.length).toEqual(10)
            expect(result.total).toEqual(10)
            expect(result.offset).toEqual(0)
            expect(result.limit).toEqual(100)
        })

        it('returns filtered samples when there is a search query', async () => {
            const findOption: FindOption = {}
            const queryDto: QueryDto = { search: 'Seed#1' }
            const result = await repository.findAll(findOption, queryDto)
            expect(result.items.length).toEqual(1)
            expect(result.total).toEqual(1)
            expect(result.offset).toEqual(0)
            expect(result.limit).toEqual(100)
        })

        it('returns paginated samples when limit and offset are provided', async () => {
            const findOption: FindOption = { limit: 5, offset: 2 }
            const queryDto: QueryDto = {}
            const result = await repository.findAll(findOption, queryDto)
            expect(result.items.length).toEqual(5)
            expect(result.total).toEqual(10)
            expect(result.offset).toEqual(2)
            expect(result.limit).toEqual(5)
        })

        it('returns samples sorted in ascending order when order is provided', async () => {
            const findOption: FindOption = { order: { name: 'name', direction: 'asc' } }
            const queryDto: QueryDto = {}
            const result = await repository.findAll(findOption, queryDto)
            expect(result.items[0].name).toEqual('Seed#0')
            expect(result.items[9].name).toEqual('Seed#9')
        })

        it('returns samples sorted in descending order when order is provided', async () => {
            const findOption: FindOption = { order: { name: 'name', direction: 'desc' } }
            const queryDto: QueryDto = {}
            const result = await repository.findAll(findOption, queryDto)
            expect(result.items[0].name).toEqual('Seed#9')
            expect(result.items[9].name).toEqual('Seed#0')
        })

        it('ignores invalid order direction', async () => {
            const findOption = { order: { name: 'name', direction: 'INVALID' } } as unknown as FindOption
            const queryDto: QueryDto = {}
            const result = await repository.findAll(findOption, queryDto)
            expect(result.items[0].name).toEqual('Seed#0')
            expect(result.items[9].name).toEqual('Seed#9')
        })
    })

    describe('transaction', () => {
        it('starts, commits, and rolls back a transaction', async () => {
            // start a transaction
            const runner = await repository.startTransaction()

            // create a new entity
            const entity = await repository.create({ name: 'New Seed' }, runner)

            entity.name = 'update name'

            // save the entity
            await repository.save(entity, runner)

            // check that the entity was saved to the database inside the transaction
            const foundEntityInTx = await repository.findById(entity.id)
            expect(foundEntityInTx).toBeDefined()

            // commit the transaction
            await repository.commitTransaction(runner)

            // check that the entity was saved to the database after the commit
            const foundEntityAfterCommit = await repository.findById(entity.id)
            expect(foundEntityAfterCommit).toBeDefined()
        })

        it('rolls back the transaction when an error occurs', async () => {
            // start another transaction
            const runner = await repository.startTransaction()

            // create a new entity
            const entity = await repository.create({ name: 'New Seed' }, runner)

            // remove the entity inside the transaction
            await repository.remove(entity, runner)

            // check that the entity was removed from the database inside the transaction
            const foundEntityAfterRemoveInTx = await repository.findById(entity.id)
            expect(foundEntityAfterRemoveInTx).toBeNull()

            // rollback the transaction
            await repository.rollbackTransaction(runner)

            // check that the entity was not removed from the database after the rollback
            const foundEntityAfterRollback = await repository.findById(entity.id)
            expect(foundEntityAfterRollback).toBeDefined()
        })
    })
})
