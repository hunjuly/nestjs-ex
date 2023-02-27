import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/database'
import { CreateSeedDto, UpdateSeedDto } from '../dto'
import { Seed } from '../entities'
import { SeedsRepository } from '../seeds.repository'
import { SeedsService } from '../seeds.service'

describe('SeedsService', () => {
    let service: SeedsService
    let repository: SeedsRepository

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [TypeOrmModule.forFeature([Seed]), DatabaseModule],
            providers: [SeedsService, SeedsRepository]
        }).compile()

        service = module.get<SeedsService>(SeedsService)
        repository = module.get<SeedsRepository>(SeedsRepository)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('create', () => {
        it('should create a new seed', async () => {
            const createSeedDto: CreateSeedDto = {
                name: 'Test Seed'
            }

            const result = await service.create(createSeedDto)

            expect(result).toBeDefined()
            expect(result.id).toBeDefined()
            expect(result.name).toEqual(createSeedDto.name)
        })
    })

    describe('findAll', () => {
        it('should return an array of seeds', async () => {
            const seeds = await service.findAll()

            expect(seeds).toBeDefined()
            expect(Array.isArray(seeds)).toBeTruthy()
        })
    })

    describe('findById', () => {
        it('should return a seed by ID', async () => {
            const createSeedDto: CreateSeedDto = {
                name: 'Test Seed'
            }
            const seed = await service.create(createSeedDto)

            const result = await service.findById(seed.id)

            expect(result).toBeDefined()
            expect(result.id).toEqual(seed.id)
            expect(result.name).toEqual(seed.name)
        })

        it('should throw a NotFoundException if seed is not found', async () => {
            const fakeSeedId = 'fake-id'

            await expect(service.findById(fakeSeedId)).rejects.toThrowError(NotFoundException)
        })
    })

    describe('update', () => {
        it('should update a seed', async () => {
            const createSeedDto: CreateSeedDto = {
                name: 'Test Seed'
            }
            const seed = await service.create(createSeedDto)

            const updateSeedDto: UpdateSeedDto = {
                name: 'Updated Test Seed'
            }

            const result = await service.update(seed.id, updateSeedDto)

            expect(result).toBeDefined()
            expect(result.id).toEqual(seed.id)
            expect(result.name).toEqual(updateSeedDto.name)
        })

        it('should throw a NotFoundException if seed is not found', async () => {
            const fakeSeedId = 'fake-id'
            const updateSeedDto: UpdateSeedDto = {
                name: 'Updated Test Seed'
            }

            await expect(service.update(fakeSeedId, updateSeedDto)).rejects.toThrowError(NotFoundException)
        })
    })

    describe('remove', () => {
        it('should remove a seed', async () => {
            const createSeedDto: CreateSeedDto = {
                name: 'Test Seed'
            }
            const seed = await service.create(createSeedDto)

            await service.remove(seed.id)

            const seeds = await service.findAll()
            expect(seeds.length).toEqual(0)
        })

        it('should throw NotFoundException if seed is not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined)
            await expect(service.remove('fake-id')).rejects.toThrow(NotFoundException)
        })
    })
})
