import { CanActivate, ExecutionContext } from '@nestjs/common'

export class NullGuard implements CanActivate {
    canActivate(_context: ExecutionContext) {
        return true
    }
}
