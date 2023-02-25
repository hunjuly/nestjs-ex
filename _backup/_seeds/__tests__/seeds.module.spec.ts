import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestRequest, createApp, createModuleWithoutGuard, createRequest } from 'src/common/jest'
import { SeedsModule } from '../seeds.module'

/* for design:
If controller and service are developed by different programmers, each isolated layer should be tested.
Even if you develop alone, if each layer is large and complex, you can divide the test.
However, this test is sufficient here. You don't have to do it for each layer.
*/
describe('/seeds', () => {
    let app: INestApplication
    let request: TestRequest

    beforeEach(async () => {
        const module = await createModuleWithoutGuard({
            modules: [SeedsModule]
        })

        app = await createApp(module)
        request = createRequest(app)
    })

    afterEach(async () => {
        await app.close()
    })

    it('/ (POST), create a seed', async () => {
        const res = await create('seed name')

        expect(res.body).toEqual({
            id: expect.any(String),
            name: 'seed name'
        })
    })

    describe('seed created', () => {
        let seedId

        beforeEach(async () => {
            const res = await create('seed name')
            seedId = res.body.id
        })

        it('already exists seed', async () => {
            const res = await create('seed name')

            expect(res.status).toEqual(HttpStatus.CONFLICT)
        })

        /*
        find all이나 pagination은 BaseService의 기능을 사용할 뿐이고 SeedsService에서 find를 구현하지 않는다.
        */
        describe('/:seedId (GET)', () => {
            it('find a seed', async () => {
                const res = await find('/' + seedId)

                expect(res.body).toEqual({
                    id: seedId,
                    name: 'seed name'
                })
            })

            it('seed not found', async () => {
                const res = await find('/unknwon-id')

                expect(res.status).toEqual(HttpStatus.NOT_FOUND)
            })
        })

        describe('/:seedId (PATCH)', () => {
            it('udpate a seed', async () => {
                const body = { name: 'new name' }

                const updateRes = await update(seedId, body)
                const findRes = await find('/' + seedId)

                expect(updateRes.body).toMatchObject(body)
                expect(findRes.body).toMatchObject(body)
            })

            it('seed not found', async () => {
                const res = await update('unknown-id', {})

                expect(res.status).toEqual(HttpStatus.NOT_FOUND)
            })

            it('already exists name', async () => {
                const createRes = await create('second name')
                const seedId = createRes.body.id
                const existName = 'seed name'

                const updateRes = await update(seedId, { name: existName })

                expect(updateRes.status).toEqual(HttpStatus.CONFLICT)
            })
        })

        describe('/:seedId (DELETE)', () => {
            it('remove a seed', async () => {
                const deleteRes = await delete_(seedId)
                const findRes = await find('/' + seedId)

                expect(deleteRes.body).toEqual({ id: seedId })
                expect(findRes.status).toEqual(HttpStatus.NOT_FOUND)
            })

            it('seed not found', async () => {
                const res = await delete_('unknown-id')

                expect(res.status).toEqual(HttpStatus.NOT_FOUND)
            })
        })
    })

    /*
    find all이나 pagination은 BaseService의 기능을 사용할 뿐이고 SeedsService에서 find를 구현하지 않는다.
    이렇게 직접 구현한 것이 아니라면 테스트를 할 필요가 없다.
    다만 아래 테스트를 남겨준 것은 BaseRepository를 대신한 것 뿐이다.
    BaseRepository 테스트를 작성해야 한다.
    */
    describe('/ (GET)', () => {
        beforeEach(async () => {
            await create('seed name1')
            await create('seed name2')
            await create('seed name3')
        })

        it('find all users', async () => {
            const res = await find('')
            const users = res.body.items

            expect(users.length).toEqual(3)
            expect(users[0].name).toEqual('seed name1')
            expect(users[1].name).toEqual('seed name2')
            expect(users[2].name).toEqual('seed name3')
        })

        it('pagination', async () => {
            const res = await find('?limit=5&offset=1')
            const users = res.body.items

            expect(res.body.offset).toEqual(1)
            expect(res.body.total).toEqual(3)

            expect(users.length).toEqual(2)
            expect(users[0].name).toEqual('seed name2')
            expect(users[1].name).toEqual('seed name3')
        })

        it('order by name:desc', async () => {
            const res = await find('?orderby=name:desc')
            const users = res.body.items

            expect(users.length).toEqual(3)
            expect(users[0].name).toEqual('seed name3')
            expect(users[1].name).toEqual('seed name2')
            expect(users[2].name).toEqual('seed name1')
        })

        it('order by wrong column name', async () => {
            const res = await find('?orderby=wrong:desc')

            expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
        })
    })

    const create = (name) =>
        request({
            method: 'post' as const,
            path: '/seeds',
            body: { name }
        })

    const find = (seedId = '') =>
        request({
            method: 'get',
            path: '/seeds' + seedId
        })

    const delete_ = (seedId) =>
        request({
            method: 'delete',
            path: '/seeds/' + seedId
        })

    const update = (seedId, body) =>
        request({
            method: 'patch',
            path: '/seeds/' + seedId,
            body
        })
})
