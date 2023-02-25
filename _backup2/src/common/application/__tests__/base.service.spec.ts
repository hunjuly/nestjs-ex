import { TypeOrmModule } from '@nestjs/typeorm'
import { createModuleWithoutGuard } from 'src/common/jest'
import { SampleRecord, SamplesRepository, SamplesService } from './mocks'

describe('BaseService', () => {
    let service: SamplesService

    beforeEach(async () => {
        const module = await createModuleWithoutGuard({
            imports: [TypeOrmModule.forFeature([SampleRecord])],
            providers: [SamplesService, SamplesRepository]
        })

        service = module.get(SamplesService)
    })

    describe('BaseService', () => {
        let sampleId

        beforeEach(async () => {
            const res = await service.create('sample name')
            sampleId = res.id
        })

        it('find', async () => {
            const res = await service.findById(sampleId)

            expect(res).toEqual({ id: sampleId, name: 'sample name' })
        })

        it('removes a sample using remove method', async () => {
            const removeRes = await service.remove(sampleId)
            expect(removeRes).toEqual({ id: sampleId })

            const findRes = service.findById(sampleId)
            await expect(findRes).rejects.toThrow(Error)
        })
    })

    it('sample not found', async () => {
        const res = service.findById('unknown-id')

        await expect(res).rejects.toThrow(Error)
    })

    it('throws an error when an invalid ID is provided to remove method', async () => {
        const res = service.remove('unknown-id')

        await expect(res).rejects.toThrow(Error)
    })

    describe('/ (GET)', () => {
        beforeEach(async () => {
            await service.create('sample name1')
            await service.create('sample name2')
            await service.create('sample name3')
        })

        it('find all', async () => {
            const res = await service.find({ limit: 10, offset: 0 })
            const users = res.items

            expect(users.length).toEqual(3)
            expect(users[0].name).toEqual('sample name1')
            expect(users[1].name).toEqual('sample name2')
            expect(users[2].name).toEqual('sample name3')
        })

        it('pagination', async () => {
            const res = await service.find({ limit: 5, offset: 1 })
            const users = res.items

            expect(res.offset).toEqual(1)
            expect(res.total).toEqual(3)

            expect(users.length).toEqual(2)
            expect(users[0].name).toEqual('sample name2')
            expect(users[1].name).toEqual('sample name3')
        })

        it('order by name:desc', async () => {
            const res = await service.find({ limit: 10, offset: 0 }, { name: 'name', direction: 'desc' })

            const users = res.items

            expect(users.length).toEqual(3)
            expect(users[0].name).toEqual('sample name3')
            expect(users[1].name).toEqual('sample name2')
            expect(users[2].name).toEqual('sample name1')
        })

        it('order by wrong column name', async () => {
            const res = service.find({ limit: 10, offset: 0 }, { name: 'wrong', direction: 'desc' })

            await expect(res).rejects.toThrow(Error)
        })
    })
})
