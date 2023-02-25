import { HttpStatus, INestApplication } from '@nestjs/common'
import { TestRequest, createApp, createModuleWithoutGuard, createRequest } from 'src/common/jest'
import { MoviesModule } from '../movies.module'

describe('/movies', () => {
    let app: INestApplication
    let request: TestRequest

    beforeEach(async () => {
        const module = await createModuleWithoutGuard({
            modules: [MoviesModule]
        })

        app = await createApp(module)
        request = createRequest(app)
    })

    afterEach(async () => {
        await app.close()
    })

    it('/ (POST), create a movie', async () => {
        const res = await create('movie title', ['action', 'sf'])

        expect(res.body).toMatchObject({
            id: expect.any(String),
            title: 'movie title',
            genre: ['action', 'sf']
        })
    })

    describe('movie created', () => {
        let movieId

        beforeEach(async () => {
            const res = await create('movie title')
            movieId = res.body.id
        })

        describe('/:movieId (GET)', () => {
            it('find a movie', async () => {
                const res = await find('/' + movieId)

                expect(res.body).toMatchObject({
                    id: movieId,
                    title: 'movie title'
                })
            })

            it('movie not found', async () => {
                const res = await find('/unknwon-id')

                expect(res.status).toEqual(HttpStatus.NOT_FOUND)
            })
        })

        describe('/:movieId (PATCH)', () => {
            it('udpate a movie', async () => {
                const body = { title: 'new title' }

                const updateRes = await update(movieId, body)
                const findRes = await find('/' + movieId)

                expect(updateRes.body).toMatchObject(body)
                expect(findRes.body).toMatchObject(body)
            })

            it('movie not found', async () => {
                const res = await update('unknown-id', {})

                expect(res.status).toEqual(HttpStatus.NOT_FOUND)
            })
        })

        describe('/:movieId (DELETE)', () => {
            it('remove a movie', async () => {
                const deleteRes = await delete_(movieId)
                const findRes = await find('/' + movieId)

                expect(deleteRes.body).toEqual({ id: movieId })
                expect(findRes.status).toEqual(HttpStatus.NOT_FOUND)
            })

            it('movie not found', async () => {
                const res = await delete_('unknown-id')

                expect(res.status).toEqual(HttpStatus.NOT_FOUND)
            })
        })
    })

    const create = (title, genre = ['action', 'sf']) =>
        request({
            method: 'post' as const,
            path: '/movies',
            body: {
                title,
                plot: 'movie plot',
                runningTimeSec: 120 * 60,
                director: 'director name',
                rated: 'r',
                genre,
                releaseDate: 20221231
            }
        })

    const find = (query = '') =>
        request({
            method: 'get',
            path: '/movies' + query
        })

    const delete_ = (movieId) =>
        request({
            method: 'delete',
            path: '/movies/' + movieId
        })

    const update = (movieId, body) =>
        request({
            method: 'patch',
            path: '/movies/' + movieId,
            body
        })
})
