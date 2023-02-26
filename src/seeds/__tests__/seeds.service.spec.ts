import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DatabaseModule } from 'src/database'
import { UpdateSeedDto } from '../dto'
import { Seed } from '../entities'
import { SeedsRepository } from '../seeds.repository'
import { SeedsService } from '../seeds.service'

describe('SeedsService', () => {
    let service: SeedsService
    let repository: Repository<Seed>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DatabaseModule],
            providers: [SeedsService, SeedsRepository]
        }).compile()

        service = module.get<SeedsService>(SeedsService)
        repository = module.get<Repository<Seed>>(getRepositoryToken(SeedsRepository))
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('findById', () => {
        const seedId = '1'
        const seedData: Seed = { id: seedId, name: 'Test Seed' }

        it('should return the found seed', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValueOnce(seedData)
            const result = await service.findById(seedId)
            expect(result).toEqual(seedData)
        })

        it('should throw NotFoundException if seed is not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined)
            await expect(service.findById(seedId)).rejects.toThrow(NotFoundException)
        })
    })

    describe('update', () => {
        const seedId = '1'
        const seedData: Seed = { id: seedId, name: 'Test Seed' }
        const updateData: UpdateSeedDto = { name: 'Updated Seed' }

        it('should return the updated seed', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValueOnce(seedData)
            jest.spyOn(repository, 'save').mockResolvedValueOnce({ ...seedData, ...updateData })
            const result = await service.update(seedId, updateData)
            expect(result).toEqual({ ...seedData, ...updateData })
        })

        it('should throw NotFoundException if seed is not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined)
            await expect(service.update(seedId, updateData)).rejects.toThrow(NotFoundException)
        })
    })

    describe('remove', () => {
        const seedId = '1'
        const seedData: Seed = { id: seedId, name: 'Test Seed' }

        it('should delete the seed', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValueOnce(seedData)
            jest.spyOn(repository, 'exist').mockResolvedValueOnce(true)
            jest.spyOn(repository, 'delete').mockResolvedValueOnce(undefined)
            await service.remove(seedId)
            expect(repository.delete).toHaveBeenCalledWith(seedId)
        })

        it('should throw NotFoundException if seed is not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined)
            await expect(service.remove(seedId)).rejects.toThrow(NotFoundException)
        })
    })
})
