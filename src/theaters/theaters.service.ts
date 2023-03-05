import { Injectable } from '@nestjs/common'
import { Expect, updateIntersection } from 'src/common'
import { FindOption } from 'src/common/base'
import { CreateTheaterDto, QueryDto, UpdateTheaterDto } from './dto'
import { TheatersRepository } from './theaters.repository'

@Injectable()
export class TheatersService {
    constructor(private theatersRepository: TheatersRepository) {}

    async create(createTheaterDto: CreateTheaterDto) {
        const theater = await this.theatersRepository.create(createTheaterDto)

        return theater
    }

    async findAll(findOption: FindOption, queryDto?: QueryDto) {
        const theaters = await this.theatersRepository.findAll(findOption, queryDto)

        return theaters
    }

    async findById(id: string) {
        const theater = await this.theatersRepository.findById(id)

        Expect.found(theater, `Theater with ID ${id} not found`)

        return theater
    }

    async update(id: string, updateTheaterDto: UpdateTheaterDto) {
        const theater = await this.theatersRepository.findById(id)

        Expect.found(theater, `Theater with ID ${id} not found`)

        const updatedTheater = updateIntersection(theater, updateTheaterDto)

        const savedTheater = await this.theatersRepository.save(updatedTheater)

        return savedTheater
    }

    async remove(id: string) {
        const theater = await this.theatersRepository.findById(id)

        Expect.found(theater, `Theater with ID ${id} not found`)

        await this.theatersRepository.remove(theater)
    }
}
