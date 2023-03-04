import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { IsInt, IsOptional, IsString } from 'class-validator'

export type OrderDirection = 'asc' | 'desc'

export class OrderOption {
    @IsString()
    name: string

    @IsString()
    direction: 'asc' | 'desc'
}

export class FindOption {
    @IsOptional()
    @IsInt()
    limit?: number

    @IsOptional()
    @IsInt()
    offset?: number

    @IsOptional()
    order?: OrderOption
}

export const FindQuery = createParamDecorator((data: unknown, context: ExecutionContext): FindOption => {
    const request = context.switchToHttp().getRequest()

    let order = undefined

    if (request.query.order) {
        const items = request.query.order.split(':')

        if (items.length === 2) {
            order = { name: items[0], direction: items[1] }
        }
    }

    const offset = request.query.offset !== undefined ? parseInt(request.query.offset, 10) : undefined
    const limit = request.query.limit !== undefined ? parseInt(request.query.limit, 10) : undefined

    return {
        offset,
        limit,
        order
    }
})

export class PaginatedResult<E> {
    @IsInt()
    offset: number

    @IsInt()
    limit: number

    @IsInt()
    total: number

    items: E[]
}
