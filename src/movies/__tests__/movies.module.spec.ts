import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { GlobalModule } from 'src/global'
import { MoviesModule } from '../movies.module'

describe('MoviesModule', () => {
    let app: INestApplication
    let server
    let movieId: string

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [GlobalModule, MoviesModule]
        }).compile()

        app = module.createNestApplication()
        await app.init()

        server = app.getHttpServer()
    })

    afterAll(async () => {
        await app.close()
    })

    describe('POST /movies', () => {
        it('creates a new movie', () => {
            return request(server)
                .post('/movies')
                .send({
                    name: 'Movie 1'
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body.id).toBeDefined()
                    expect(res.body.name).toEqual('Movie 1')

                    movieId = res.body.id
                })
        })
    })

    describe('/movies (GET)', () => {
        it('returns movies with query options', async () => {
            const queryDto = {
                order: 'name:desc',
                limit: 1,
                offset: 0,
                search: 'Movie 1'
            }

            return request(server)
                .get('/movies')
                .query(queryDto)
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body.items)).toBeTruthy()
                    expect(res.body.items.length).toBe(1)
                    expect(res.body.items[0].name).toBe('Movie 1')
                    expect(typeof res.body.offset).toBe('number')
                    expect(typeof res.body.limit).toBe('number')
                    expect(typeof res.body.total).toBe('number')
                })
        })

        it('returns movies with default options', async () => {
            return request(server)
                .get('/movies')
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body.items)).toBeTruthy()
                    expect(res.body.items.length).toBeGreaterThan(0)
                    expect(typeof res.body.offset).toBe('number')
                    expect(typeof res.body.limit).toBe('number')
                    expect(typeof res.body.total).toBe('number')
                })
        })
    })

    describe('GET /movies/:id', () => {
        it('returns the movie with the given id', () => {
            return request(server)
                .get(`/movies/${movieId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toEqual(movieId)
                    expect(res.body.name).toBeDefined()
                })
        })

        it('returns a 404 error when the movie is not found', () => {
            return request(server).get('/movies/999').expect(404)
        })
    })

    describe('PATCH /movies/:id', () => {
        it('updates the movie with the given id', () => {
            return request(server)
                .patch(`/movies/${movieId}`)
                .send({
                    name: 'Updated Movie'
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toEqual(movieId)
                    expect(res.body.name).toEqual('Updated Movie')
                })
        })

        it('returns a 404 error when the movie is not found', () => {
            return request(server)
                .patch('/movies/999')
                .send({
                    name: 'Updated Movie'
                })
                .expect(404)
        })
    })

    describe('DELETE /movies/:id', () => {
        it('deletes the movie with the given id', () => {
            return request(server).delete(`/movies/${movieId}`).expect(200)
        })

        it('returns a 404 error when the movie is not found', () => {
            return request(server).delete('/movies/999').expect(404)
        })
    })
})
