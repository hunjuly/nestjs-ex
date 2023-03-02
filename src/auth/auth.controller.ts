// import { Controller, Post, Request, UseGuards } from '@nestjs/common'
// import { LocalAuthGuard } from './local-auth.guard'
// @Controller()
// export class AuthController {
//     @UseGuards(LocalAuthGuard)
//     @Post('auth/login')
//     async login(@Request() req) {
//         return req.user
//     }
// }
import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt-auth.guard'
import { LocalAuthGuard } from './local-auth.guard'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user)
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        console.log('req.user', req.user)
        return req.user
    }
}

// import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
// import { AuthService } from './auth.service'
// import { LoginDto } from './dto'

// @Controller('auth')
// export class AuthController {
//     constructor(private readonly authService: AuthService) {}

//     @Post('login')
//     @HttpCode(HttpStatus.OK)
//     async login(@Body() loginDto: LoginDto) {
//         const { accessToken, refreshToken } = await this.authService.login(loginDto)
//         return { accessToken, refreshToken }
//     }
// }
