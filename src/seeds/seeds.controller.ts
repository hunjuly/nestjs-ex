import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { CreateSeedDto } from './dto/create-seed.dto'
import { UpdateSeedDto } from './dto/update-seed.dto'
import { SeedsService } from './seeds.service'

@Controller('seeds')
export class SeedsController {
    constructor(private readonly seedsService: SeedsService) {}

    @Post()
    create(@Body() createSeedDto: CreateSeedDto) {
        return this.seedsService.create(createSeedDto)
    }

    @Get()
    findAll() {
        return this.seedsService.findAll()
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.seedsService.findById(id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSeedDto: UpdateSeedDto) {
        return this.seedsService.update(id, updateSeedDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.seedsService.remove(id)
    }
}
