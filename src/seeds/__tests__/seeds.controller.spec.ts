import { NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { CreateSeedDto, UpdateSeedDto } from '../dto'
import { Seed } from '../entities'
import { SeedsController } from '../seeds.controller'
import { SeedsService } from '../seeds.service'

describe('SeedsController', () => {
    let seedsController: SeedsController
    let seedsService: SeedsService

    const seed1 = new Seed()
    seed1.id = '123e4567-e89b-12d3-a456-426614174000'
    seed1.name = 'Seed 1'

    const createSeedDto: CreateSeedDto = {
        name: 'Seed 2'
    }

    const updateSeedDto: UpdateSeedDto = {
        name: 'Updated Seed'
    }

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [SeedsController],
            providers: [SeedsService]
        }).compile()

        seedsController = moduleRef.get<SeedsController>(SeedsController)
        seedsService = moduleRef.get<SeedsService>(SeedsService)
    })

    describe('create', () => {
        it('should return a new seed', async () => {
            const createdSeed = new Seed()
            createdSeed.id = '123e4567-e89b-12d3-a456-426614174001'
            createdSeed.name = createSeedDto.name
            jest.spyOn(seedsService, 'create').mockResolvedValue(createdSeed)

            const result = await seedsController.create(createSeedDto)

            expect(result).toEqual(createdSeed)
        })
    })

    describe('findAll', () => {
        it('should return an array of seeds', async () => {
            const seeds = [seed1]
            jest.spyOn(seedsService, 'findAll').mockResolvedValue(seeds)

            const result = await seedsController.findAll()

            expect(result).toEqual(seeds)
        })
    })

    describe('findOne', () => {
        it('should return a seed', async () => {
            jest.spyOn(seedsService, 'findOne').mockResolvedValue(seed1)

            const result = await seedsController.findOne(seed1.id)

            expect(result).toEqual(seed1)
        })

        it('should throw a NotFoundException if seed is not found', async () => {
            jest.spyOn(seedsService, 'findOne').mockResolvedValue(null)

            expect(seedsController.findOne('invalid-id')).rejects.toThrowError(NotFoundException)
        })
    })

    describe('update', () => {
        it('should return the updated seed', async () => {
            const updatedSeed = new Seed()
            updatedSeed.id = seed1.id
            updatedSeed.name = updateSeedDto.name
            jest.spyOn(seedsService, 'update').mockResolvedValue(updatedSeed)

            const result = await seedsController.update(seed1.id, updateSeedDto)

            expect(result).toEqual(updatedSeed)
        })

        it('should throw a NotFoundException if seed is not found', async () => {
            jest.spyOn(seedsService, 'update').mockResolvedValue(null)

            expect(seedsController.update('invalid-id', updateSeedDto)).rejects.toThrowError(
                NotFoundException
            )
        })
    })

    //   describe('remove', () => {
    //     it('should not throw any error', async () => {
    //       jest.spyOn(seeds

    //     describe('/seeds/:id (DELETE)', () => {
    //         it('should delete a seed by id', async () => {
    //             const createSeedDto = { name: 'test seed' }
    //             const savedSeed = await seedRepository.save(seedRepository.create(createSeedDto))

    //             await request(app.getHttpServer()).delete(`/seeds/${savedSeed.id}`).expect(200)

    //             const seed = await seedRepository.findOne(savedSeed.id)
    //             expect(seed).toBeUndefined()
    //         })
    //     })
})
