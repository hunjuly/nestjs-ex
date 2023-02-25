import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { SystemException } from 'src/common'
import { TestRequest, createApp, createRequest } from 'src/common/jest'
import { GlobalModule } from 'src/global.module'
import { AuthsModule } from '../auths.module'
import { AuthsService } from '../auths.service'
import { CreateAuthDto } from '../auths.service'

describe('/auths', () => {
    let app: INestApplication
    let request: TestRequest
    let service: AuthsService

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [GlobalModule, AuthsModule]
        }).compile()

        app = await createApp(module)
        request = createRequest(app)

        service = module.get(AuthsService)
    })

    afterEach(async () => {
        await app.close()
    })

    describe('auth 생성', () => {
        it('member', async () => {
            const auth = await service.create(member as CreateAuthDto)

            expect(auth).toMatchObject({ userId: expect.any(String) })
        })

        it('admin', async () => {
            const auth = await service.create(admin as CreateAuthDto)

            expect(auth).toMatchObject({ userId: expect.any(String) })
        })

        it('이미 존재하는 auth는 실패한다', async () => {
            await service.create(member as CreateAuthDto)
            const promise = service.create(member as CreateAuthDto)

            await expect(promise).rejects.toThrow(SystemException)
        })

        describe('login', () => {
            beforeEach(async () => {
                await service.create(member as CreateAuthDto)
                await service.create(admin as CreateAuthDto)
            })

            it('member', async () => {
                const res = await login(member.email, member.password)

                expect(res.body).toMatchObject({
                    refreshToken: expect.any(String),
                    accessToken: expect.any(String)
                })
            })

            it('admin', async () => {
                const res = await login(admin.email, admin.password)

                expect(res.body).toMatchObject({
                    refreshToken: expect.any(String),
                    accessToken: expect.any(String)
                })
            })

            it('email이 존재하지 않음', async () => {
                const res = await login('wrong', 'wrong')

                expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
            })

            it('password가 틀림', async () => {
                const res = await login(member.email, 'wrong')

                expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
            })

            describe('with authentication', () => {
                const refreshToken = { member: undefined, admin: undefined }
                const accessToken = { member: undefined, admin: undefined }

                beforeEach(async () => {
                    const memberRes = await login(member.email, member.password)
                    refreshToken.member = memberRes.body.refreshToken
                    accessToken.member = memberRes.body.accessToken

                    const adminRes = await login(admin.email, admin.password)
                    refreshToken.admin = adminRes.body.refreshToken
                    accessToken.admin = adminRes.body.accessToken
                })

                it('refreshToken은 서로 다르다', async () => {
                    expect(refreshToken.member !== refreshToken.admin).toBeTruthy()
                })

                it('SelfGuard, memberID는 accessToken과 일치해야 한다', async () => {
                    const res = await selfGuard(member.userId, accessToken.member)

                    expect(res.status).toEqual(HttpStatus.OK)
                })

                it('SelfGuard, admin은 self가 아니어도 된다', async () => {
                    const res = await selfGuard(member.userId, accessToken.admin)

                    expect(res.status).toEqual(HttpStatus.OK)
                })

                it('AdminGuard, member는 사용 불가', async () => {
                    const res = await adminGuard(accessToken.member)

                    expect(res.status).toEqual(HttpStatus.FORBIDDEN)
                })

                it('AdminGuard, admin은 사용 가능', async () => {
                    const res = await adminGuard(accessToken.admin)

                    expect(res.status).toEqual(HttpStatus.OK)
                })

                it('invalid accessToken', async () => {
                    const res = await selfGuard(member.userId, 'wrong token')

                    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
                })

                it('accessToken 재발급', async () => {
                    const res = await refresh(refreshToken.member)

                    expect(res.body.accessToken).toEqual(expect.any(String))
                    expect(res.body.accessToken).not.toEqual(accessToken.member)
                })

                it('logout', async () => {
                    const res = await logout(accessToken.member)

                    expect(res.status).toEqual(HttpStatus.OK)
                })

                it('auth 삭제', async () => {
                    const success = await service.remove(member.userId)

                    expect(success).toBeTruthy()
                })

                describe('logout', () => {
                    beforeEach(async () => {
                        await logout(accessToken.member)
                    })

                    it('accessToken 재발급 불가', async () => {
                        const res = await refresh(refreshToken.member)

                        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
                    })
                })

                describe('auth 삭제', () => {
                    beforeEach(async () => {
                        await service.remove(member.userId)
                    })

                    it('login 불가', async () => {
                        const res = await login(member.email, member.password)

                        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
                    })

                    it('accessToken 재발급 불가', async () => {
                        const res = await refresh(refreshToken.member)

                        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
                    })
                })
            })

            describe('expired tokens', () => {
                beforeEach(() => {
                    jest.useFakeTimers()
                })

                afterEach(() => {
                    jest.useRealTimers()
                })

                it('60초 후 accessToken 만료', async () => {
                    const loginRes = await login(member.email, member.password)

                    await jest.advanceTimersByTime(60 * 1000)

                    const res = await selfGuard(member.userId, loginRes.accessToken)

                    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
                })

                it('24시간 후 refreshToken 만료', async () => {
                    const loginRes = await login(member.email, member.password)

                    await jest.advanceTimersByTime(24 * 60 * 60 * 1000)

                    const res = await refresh(loginRes.refreshToken)

                    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED)
                })
            })
        })
    })

    const member = {
        email: 'memberA@mail.com',
        password: '1234',
        userId: 'memberA',
        role: 'member'
    }

    const admin = {
        email: 'adminA@mail.com',
        password: '!@#$',
        userId: 'adminA',
        role: 'admin'
    }

    const login = (email, password) =>
        request({
            method: 'post' as const,
            path: '/auths/login',
            body: { email, password }
        })

    const logout = (accessToken) =>
        request({
            method: 'post' as const,
            path: '/auths/logout',
            accessToken
        })

    const refresh = (refreshToken) =>
        request({
            method: 'post' as const,
            path: '/auths/refresh',
            body: { refreshToken }
        })

    const adminGuard = (accessToken) =>
        request({
            method: 'get' as const,
            path: '/auths/test/admin-guard',
            accessToken
        })

    const selfGuard = (userId, accessToken) =>
        request({
            method: 'get' as const,
            path: '/auths/test/self-guard/' + userId,
            accessToken
        })
})
