import { Test, TestingModule } from '@nestjs/testing'
import { SeedDto } from '../dto'
import { CreateSeedDto } from '../dto/create-seed.dto'
import { UpdateSeedDto } from '../dto/update-seed.dto'
import { SeedsController } from '../seeds.controller'
import { SeedsService } from '../seeds.service'

describe('SeedsController', () => {
    let controller: SeedsController
    let service: SeedsService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SeedsController],
            providers: [
                {
                    provide: SeedsService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findById: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn()
                    }
                }
            ]
        }).compile()

        controller = module.get<SeedsController>(SeedsController)
        service = module.get<SeedsService>(SeedsService)
    })

    describe('create', () => {
        it('should create a new seed', async () => {
            const createSeedDto: CreateSeedDto = {
                name: 'test seed'
            }
            const expectedSeed: SeedDto = {
                id: '123',
                name: 'test seed'
            }
            jest.spyOn(service, 'create').mockResolvedValue(expectedSeed)

            const result = await controller.create(createSeedDto)

            expect(result).toBe(expectedSeed)
            expect(service.create).toHaveBeenCalledWith(createSeedDto)
        })
    })

    describe('findAll', () => {
        it('should return an array of seeds', async () => {
            const expectedSeeds: SeedDto[] = [
                { id: '123', name: 'seed 1' },
                { id: '456', name: 'seed 2' }
            ]
            jest.spyOn(service, 'findAll').mockResolvedValue(expectedSeeds)

            const result = await controller.findAll()

            expect(result).toBe(expectedSeeds)
            expect(service.findAll).toHaveBeenCalled()
        })
    })

    describe('findById', () => {
        it('should return a seed by ID', async () => {
            const expectedSeed: SeedDto = {
                id: '123',
                name: 'test seed'
            }
            jest.spyOn(service, 'findById').mockResolvedValue(expectedSeed)

            const result = await controller.findById('123')

            expect(result).toBe(expectedSeed)
            expect(service.findById).toHaveBeenCalledWith('123')
        })
    })

    describe('update', () => {
        it('should update a seed by ID', async () => {
            const updateSeedDto: UpdateSeedDto = {
                name: 'updated seed'
            }
            const expectedSeed: SeedDto = {
                id: '123',
                name: 'updated seed'
            }
            jest.spyOn(service, 'update').mockResolvedValue(expectedSeed)

            const result = await controller.update('123', updateSeedDto)

            expect(result).toBe(expectedSeed)
            expect(service.update).toHaveBeenCalledWith('123', updateSeedDto)
        })
    })

    describe('remove', () => {
        it('should remove a seed', async () => {
            const id = '123'

            jest.spyOn(service, 'remove').mockResolvedValue(undefined)

            const response = await controller.remove(id)

            expect(response).toBeUndefined()
            expect(service.remove).toHaveBeenCalledWith(id)
        })
    })
})
