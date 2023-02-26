import { NotFoundException } from '@nestjs/common'

export class Expect {
    static found(value: any, message: string) {
        if (!value) {
            throw new NotFoundException(message)
        }
    }
}
