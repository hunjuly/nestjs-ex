import { Controller, Get, HttpCode, Logger, Post, Request, UseGuards } from '@nestjs/common'
import { AuthsService } from './auths.service'
import { AdminGuard, JwtAuthGuard, LocalAuthGuard, Self, SelfGuard } from './guards'

@Controller('auths')
export class AuthsController {
    constructor(private readonly service: AuthsService) {}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    login(@Request() req) {
        const { userId, role } = req.user

        return this.service.login(userId, role)
    }

    @Post('logout')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async logout(@Request() req) {
        const { userId } = req.user

        await this.service.logout(userId)

        await req.logout((err) => {
            if (err) {
                Logger.error(err)
            }
        })
    }

    // api 쓰로틀 설정하자
    @Post('refresh')
    refresh(@Request() req) {
        const { refreshToken } = req.body

        return this.service.refresh(refreshToken)
    }

    @Get('test/admin-guard')
    @UseGuards(JwtAuthGuard, AdminGuard)
    adminTest() {}

    @Get('test/self-guard/:userId')
    @Self({ userIDParam: 'userId', allowAdmins: true })
    @UseGuards(JwtAuthGuard, SelfGuard)
    memberTest() {}
}
