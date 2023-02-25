import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestRequest, createApp, createModuleWithoutGuard, createRequest } from 'src/common/jest'
import { UsersModule } from '../users.module'

describe('/users', () => {
    let app: INestApplication
    let request: TestRequest

    beforeEach(async () => {
        const module = await createModuleWithoutGuard({
            modules: [UsersModule]
        })

        app = await createApp(module)
        request = createRequest(app)
    })

    afterEach(async () => {
        await app.close()
    })

    it('/ (POST), create a user', async () => {
        const res = await create('user@mail.com', 'password', 'user name', 'member')

        expect(res.body).toEqual({
            id: expect.any(String),
            email: 'user@mail.com',
            username: 'user name',
            createDate: expect.any(String),
            updateDate: expect.any(String)
        })
    })

    describe('user created', () => {
        let userId

        beforeEach(async () => {
            const res = await create('user@mail.com', 'password', 'user name', 'member')
            userId = res.body.id
        })

        it('already exists email', async () => {
            const res = await create('user@mail.com', '_', '_', '_')

            expect(res.status).toEqual(HttpStatus.CONFLICT)
        })

        describe('/:userId (GET)', () => {
            it('find a user', async () => {
                const res = await find('/' + userId)

                expect(res.body).toEqual({
                    id: userId,
                    email: 'user@mail.com',
                    username: 'user name',
                    createDate: expect.any(String),
                    updateDate: expect.any(String)
                })
            })

            it('user not found', async () => {
                const res = await find('/unknwon-id')

                expect(res.status).toEqual(HttpStatus.NOT_FOUND)
            })
        })

        describe('/:userId (PATCH)', () => {
            it('udpate a user', async () => {
                const body = { email: 'new@mail.com', username: 'new name' }

                const updateRes = await update(userId, body)
                const findRes = await find('/' + userId)

                expect(updateRes.body).toMatchObject(body)
                expect(findRes.body).toMatchObject(body)
            })

            it('user not found', async () => {
                const res = await update('unknown-id', {})

                expect(res.status).toEqual(HttpStatus.NOT_FOUND)
            })

            it('already exists email', async () => {
                const createRes = await create('second@mail.com', 'password', 'second user', 'member')
                const userId = createRes.body.id
                const existEmail = 'user@mail.com'

                const updateRes = await update(userId, { email: existEmail })

                expect(updateRes.status).toEqual(HttpStatus.CONFLICT)
            })
        })

        describe('/:userId (DELETE)', () => {
            it('remove a user', async () => {
                const deleteRes = await delete_(userId)
                const findRes = await find('/' + userId)

                expect(deleteRes.body).toEqual({ id: userId })
                expect(findRes.status).toEqual(HttpStatus.NOT_FOUND)
            })

            it('user not found', async () => {
                const res = await delete_('unknown-id')

                expect(res.status).toEqual(HttpStatus.NOT_FOUND)
            })
        })
    })

    const create = (email, password, username, role) =>
        request({
            method: 'post' as const,
            path: '/users',
            body: { email, password, username, role }
        })

    const find = (query) =>
        request({
            method: 'get',
            path: '/users' + query
        })

    const delete_ = (userId) =>
        request({
            method: 'delete',
            path: '/users/' + userId
        })

    const update = (userId, body) =>
        request({
            method: 'patch',
            path: '/users/' + userId,
            body
        })
})
