import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { OrderOption } from 'src/common/application'
import { createModuleWithoutGuard, createStub, createTypeOrmMock } from 'src/common/jest'
import { SeedRecord } from '../records/seed.record'
import { SeedsRepository } from '../seeds.repository'

/*
typeorm은 stub으로 구현했다.
typeorm은 외부 라이브러리이고 어떤 형태로 값을 받을 것인지는 블랙박스로 취급해야 한다.
*/
describe('SeedsRepository', () => {
    let repository: SeedsRepository
    let typeorm: Repository<SeedRecord>

    beforeEach(async () => {
        const typeormProvider = {
            provide: getRepositoryToken(SeedRecord),
            useValue: createTypeOrmMock()
        }

        const module = await createModuleWithoutGuard({
            providers: [SeedsRepository, typeormProvider]
        })

        repository = module.get(SeedsRepository)
        typeorm = module.get(typeormProvider.provide)
    })

    it('should be defined', () => {
        expect(repository).toBeDefined()
    })

    it('create', async () => {
        const createDto = { name: 'seed name' }
        const seed = { id: 'uuid#1', name: 'seed name' }

        const spy = createStub(typeorm, 'save', seed)

        const recv = await repository.create(createDto)

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(seed)
    })

    it('findAll', async () => {
        const pageOption = { offset: 0, limit: 10 }
        const seeds = [
            { id: 'uuid#1', name: 'seed1@test.com' },
            { id: 'uuid#2', name: 'seed2@test.com' },
            { id: 'uuid#3', name: 'seed3@test.com' }
        ]
        const orderOption = { name: 'createDate', direction: 'desc' } as OrderOption

        const spy = createStub(typeorm, 'findAndCount', [seeds, seeds.length])

        const recv = await repository.find(pageOption, orderOption)

        expect(spy).toHaveBeenCalled()
        expect(recv.total).toEqual(seeds.length)
        expect(recv.items).toMatchObject(seeds)
    })

    it('findById', async () => {
        const seed = { id: 'uuid#1', name: 'seed name' }

        const spy = createStub(typeorm, 'findOneBy', seed)

        const recv = await repository.findById('uuid#1')

        expect(spy).toHaveBeenCalled()
        expect(recv).toMatchObject(seed)
    })

    it('remove', async () => {
        const spy = createStub(typeorm, 'delete', { affected: 1 })

        const recv = await repository.remove('uuid#1')

        expect(spy).toHaveBeenCalled()
        expect(recv).toBeTruthy()
    })

    it('update', async () => {
        const updateDto = { name: 'new name' }

        const spy = createStub(typeorm, 'update', { affected: 1 })

        const recv = await repository.update('uuid#1', updateDto)

        expect(spy).toHaveBeenCalled()
        expect(recv).toBeTruthy()
    })
})
