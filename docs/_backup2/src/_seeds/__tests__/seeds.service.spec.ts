import { OrderOption } from 'src/common/application'
import { createModuleWithoutGuard, createSpy } from 'src/common/jest'
import { SeedsRepository } from '../seeds.repository'
import { SeedsService } from '../seeds.service'

jest.mock('../seeds.repository')

describe('SeedsService', () => {
    let service: SeedsService
    let repository: SeedsRepository

    beforeEach(async () => {
        const module = await createModuleWithoutGuard({
            providers: [SeedsService, SeedsRepository]
        })

        service = module.get(SeedsService)
        repository = module.get(SeedsRepository)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('create', async () => {
        const createDto = { name: 'seed name' }
        const seed = { id: 'uuid#1', name: 'seed name' }

        const spy = createSpy(repository, 'create', [createDto], seed)

        const recv = await service.create(createDto)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(seed)
    })

    it('findAll', async () => {
        const pageOption = { offset: 0, limit: 10 }
        const pagedResult = {
            offset: 0,
            limit: 10,
            total: 2,
            items: [
                { id: 'uuid#1', name: 'seed1@test.com' },
                { id: 'uuid#2', name: 'seed2@test.com' },
                { id: 'uuid#3', name: 'seed3@test.com' }
            ]
        }
        const orderOption = { name: 'createDate', direction: 'desc' } as OrderOption

        const ___ = createSpy(repository, 'hasColumn', undefined, true)
        const spy = createSpy(repository, 'find', [pageOption, orderOption], pagedResult)

        const recv = await service.find(pageOption, orderOption)

        expect(spy).toHaveBeenCalled()
        expect(recv.items).toMatchObject(pagedResult.items)
    })

    it('findById', async () => {
        const seed = { id: 'uuid#1', name: 'seed name' }

        const spy = createSpy(repository, 'findById', ['uuid#1'], seed)

        const recv = await service.findById('uuid#1')

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(seed)
    })

    it('remove', async () => {
        const seed = { id: 'uuid#1', name: 'seed name' }

        const ___ = createSpy(repository, 'findById', ['uuid#1'], seed)
        const spy = createSpy(repository, 'remove', ['uuid#1'], true)

        const recv = await service.remove('uuid#1')

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject({ id: 'uuid#1' })
    })

    it('update a seed', async () => {})
})
