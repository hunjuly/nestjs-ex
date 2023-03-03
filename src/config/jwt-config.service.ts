import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtConfigService {
    constructor(private config: ConfigService) {}

    get accessSecret() {
        return this.config.get<string>('ACCESS_SECRET')
    }
    get accessTokenExpiration() {
        return this.config.get<string>('ACCESS_TOKEN_EXPIRATION')
    }
    get refreshSecret() {
        return this.config.get<string>('REFRESH_SECRET')
    }
    get refreshTokenExpiration() {
        return this.config.get<string>('REFRESH_TOKEN_EXPIRATION')
    }
}
