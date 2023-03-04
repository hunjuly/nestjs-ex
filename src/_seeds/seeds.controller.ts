import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { FindOption, FindQuery } from 'src/common/base'
import { CreateSeedDto, QueryDto, SeedDto, UpdateSeedDto } from './dto'
import { SeedsService } from './seeds.service'

@Controller('seeds')
export class SeedsController {
    constructor(private readonly seedsService: SeedsService) {}

    @Post()
    async create(@Body() createSeedDto: CreateSeedDto) {
        const seed = await this.seedsService.create(createSeedDto)

        return new SeedDto(seed)
    }

    @Get()
    async findAll(@FindQuery() findOption: FindOption, @Query() query: QueryDto) {
        const seeds = await this.seedsService.findAll(findOption, query)

        const items = seeds.items.map((seed) => new SeedDto(seed))

        return { ...seeds, items }
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        const seed = await this.seedsService.findById(id)

        return new SeedDto(seed)
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateSeedDto: UpdateSeedDto) {
        const seed = await this.seedsService.update(id, updateSeedDto)

        return new SeedDto(seed)
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.seedsService.remove(id)
    }
}

/*
Q: 엔티티에서 DTO로 변환하는 작업을 controller에서 하는 이유

A:
엔티티는 데이터베이스와 직접적으로 상호작용하며 데이터베이스에서 가져온 데이터를 객체 형태로 표현하는데 사용됩니다.
따라서 엔티티의 구조는 데이터베이스 스키마와 매우 유사하며, 다양한 관계와 연결이 포함될 수 있습니다.

반면, DTO(Data Transfer Object)는 데이터 전송을 위한 객체입니다.
DTO는 클라이언트나 외부 시스템과의 데이터 통신에 사용됩니다.
DTO는 주로 엔티티와 마찬가지로 데이터 구조를 나타내지만, 클라이언트에서 필요한 정보만 포함하도록 제한할 수 있습니다.

따라서, 엔티티는 데이터베이스 스키마와 매우 유사하고 더 많은 정보와 관계를 포함하지만,
DTO는 필요한 정보만 포함하도록 제한하여 클라이언트와의 데이터 전송을 간소화하고 보안성을 높이기 위해 사용됩니다.

따라서, 컨트롤러에서 DTO로 변환하는 것은 엔티티의 노출을 최소화하고,
클라이언트에게 필요한 최소한의 정보만 전달함으로써 보안성을 높이기 위한 것입니다.
또한, DTO를 사용하면 API의 유연성이 높아져, 엔티티의 변경이나 추가 필드에 대한 영향을 최소화할 수 있습니다.
*/
