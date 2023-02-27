import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/database'
import { CreateSeedDto, UpdateSeedDto } from '../dto'
import { Seed } from '../entities'
import { SeedsController } from '../seeds.controller'
import { SeedsRepository } from '../seeds.repository'
import { SeedsService } from '../seeds.service'

describe('SeedsController', () => {
    let controller: SeedsController
    let service: SeedsService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [TypeOrmModule.forFeature([Seed]), DatabaseModule],
            controllers: [SeedsController],
            providers: [SeedsService, SeedsRepository]
        }).compile()

        controller = module.get<SeedsController>(SeedsController)
        service = module.get<SeedsService>(SeedsService)
    })

    it('should call SeedsService.create method with the provided dto', () => {
        const dto: CreateSeedDto = { name: 'test' }
        jest.spyOn(service, 'create').mockResolvedValueOnce({ id: '1', name: 'test' })

        expect(controller.create(dto)).resolves.toEqual({ id: '1', name: 'test' })
        expect(service.create).toHaveBeenCalledWith(dto)
    })

    it('should call SeedsService.findAll method', () => {
        jest.spyOn(service, 'findAll').mockResolvedValueOnce([{ id: '1', name: 'test' }])

        expect(controller.findAll()).resolves.toEqual([{ id: '1', name: 'test' }])
        expect(service.findAll).toHaveBeenCalled()
    })

    it('should call SeedsService.findById method with the provided id', () => {
        const id = '1'
        jest.spyOn(service, 'findById').mockResolvedValueOnce({ id: '1', name: 'test' })

        expect(controller.findById(id)).resolves.toEqual({ id: '1', name: 'test' })
        expect(service.findById).toHaveBeenCalledWith(id)
    })

    it('should call SeedsService.update method with the provided id and dto', () => {
        const id = '1'
        const dto: UpdateSeedDto = { name: 'updated' }
        jest.spyOn(service, 'update').mockResolvedValueOnce({ id: '1', name: 'updated' })

        expect(controller.update(id, dto)).resolves.toEqual({ id: '1', name: 'updated' })
        expect(service.update).toHaveBeenCalledWith(id, dto)
    })

    it('should call SeedsService.remove method with the provided id', () => {
        const id = '1'
        jest.spyOn(service, 'remove').mockResolvedValueOnce()

        expect(controller.remove(id)).resolves.toEqual(undefined)
        expect(service.remove).toHaveBeenCalledWith(id)
    })
})
