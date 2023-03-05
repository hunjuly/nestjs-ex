import { EntityId } from 'src/common/base'

export interface JwtPayload {
    jti?: string
    userId: EntityId
    email: string
    iat?: number
    exp?: number
}
