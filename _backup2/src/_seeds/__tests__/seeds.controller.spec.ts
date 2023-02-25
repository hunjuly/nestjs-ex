import 'jest'
import { createModuleWithoutGuard, createSpy } from 'src/common/jest'
import { SeedsController } from '../seeds.controller'
import { SeedsService } from '../seeds.service'

jest.mock('../seeds.service')

describe('SeedsController', () => {
    let controller: SeedsController
    let service: SeedsService

    beforeEach(async () => {
        const module = await createModuleWithoutGuard({
            controllers: [SeedsController],
            providers: [SeedsService]
        })

        controller = module.get(SeedsController)
        service = module.get(SeedsService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    it('create', async () => {
        const createDto = { name: 'seed name' }
        const seed = { id: 'uuid#1', name: 'seed name' }

        const spy = createSpy(service, 'create', [createDto], seed)

        const recv = await controller.create(createDto)

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

        const spy = createSpy(service, 'find', [pageOption], pagedResult)

        const result = await controller.find(pageOption)

        expect(spy).toHaveBeenCalled()
        expect(result.items).toMatchObject(pagedResult.items)
    })

    it('findById', async () => {
        const seed = { id: 'uuid#1', name: 'seed name' }

        const spy = createSpy(service, 'findById', ['uuid#1'], seed)

        const recv = await controller.findById('uuid#1')

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(seed)
    })

    it('remove', async () => {
        const removeResult = { id: 'uuid#1' }

        const spy = createSpy(service, 'remove', ['uuid#1'], removeResult)

        const recv = await controller.remove('uuid#1')

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(removeResult)
    })

    it('update', async () => {
        const updateDto = { name: 'new name' }
        const updatedSeed = { id: 'uuid#1', name: 'new name' }

        const spy = createSpy(service, 'update', ['uuid#1', updateDto], updatedSeed)

        const recv = await controller.update('uuid#1', updateDto)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(updatedSeed)
    })
})
