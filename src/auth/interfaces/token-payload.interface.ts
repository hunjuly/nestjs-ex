import { EntityId } from 'src/common/base'

export interface TokenPayload {
    userId: EntityId
    email: string
}
