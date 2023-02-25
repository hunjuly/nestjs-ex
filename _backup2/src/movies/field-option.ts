import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export class FieldOption {
    name: string
    value: string
}

export const FieldQuery = createParamDecorator((data: unknown, context: ExecutionContext): FieldOption => {
    const request = context.switchToHttp().getRequest()

    // buyable=true
    if (request.query.buyable) {
        return { name: 'buyable', value: request.query.buyable }
    }

    return undefined
})
