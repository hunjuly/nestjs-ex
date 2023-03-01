import { Test, TestingModule } from '@nestjs/testing'
import { plainToInstance } from 'class-transformer'
import { CreateSeedDto, SeedDto, UpdateSeedDto } from '../dto'
import { Seed } from '../entities'
import { SeedsRepository } from '../seeds.repository'
import { SeedsService } from '../seeds.service'

describe('SeedsService', () => {
    let service: SeedsService
    let repository: SeedsRepository

    const testSeed: Seed = plainToInstance(Seed, { id: '123', name: 'testSeed' })
    const testSeedDto = new SeedDto(testSeed)

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SeedsService,
                {
                    provide: SeedsRepository,
                    useValue: {
                        create: jest.fn().mockResolvedValue(testSeed),
                        findAll: jest.fn().mockResolvedValue([testSeed]),
                        findById: jest.fn().mockResolvedValue(testSeed),
                        remove: jest.fn(),
                        save: jest.fn().mockResolvedValue(testSeed)
                    }
                }
            ]
        }).compile()

        service = module.get<SeedsService>(SeedsService)
        repository = module.get<SeedsRepository>(SeedsRepository)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('create', () => {
        const createSeedDto: CreateSeedDto = {
            name: 'testSeed'
        }

        it('should create a new seed', async () => {
            const result = await service.create(createSeedDto)
            expect(result).toEqual(testSeedDto)
        })
    })

    describe('findAll', () => {
        it('should return all seeds', async () => {
            const result = await service.findAll()
            expect(result).toEqual([testSeedDto])
        })
    })

    describe('findById', () => {
        const id = '123'

        it('should return a seed by id', async () => {
            const result = await service.findById(id)
            expect(result).toEqual(testSeedDto)
        })

        it('should throw an error if the seed is not found', async () => {
            jest.spyOn(repository, 'findById').mockResolvedValue(undefined)
            await expect(service.findById(id)).rejects.toThrow(`Seed with ID ${id} not found`)
        })
    })

    describe('update', () => {
        const id = '123'
        const updateSeedDto: UpdateSeedDto = {
            name: 'updatedTestSeed'
        }

        it('should update a seed by id', async () => {
            const result = await service.update(id, updateSeedDto)

            expect(result).toEqual({ id: '123', name: 'updatedTestSeed' })
        })

        it('should throw an error if the seed is not found', async () => {
            jest.spyOn(repository, 'findById').mockResolvedValue(undefined)
            await expect(service.update(id, updateSeedDto)).rejects.toThrow(`Seed with ID ${id} not found`)
        })
    })

    describe('remove', () => {
        const id = '123'

        it('should remove a seed by id', async () => {
            await service.remove(id)
            expect(repository.remove).toHaveBeenCalledWith(testSeed)
        })

        it('should throw an error if the seed is not found', async () => {
            jest.spyOn(repository, 'findById').mockResolvedValue(undefined)
            await expect(service.remove(id)).rejects.toThrow(`Seed with ID ${id} not found`)
        })
    })
})
