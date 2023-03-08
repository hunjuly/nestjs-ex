import * as request from 'supertest'
import { HttpStatus, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { GlobalModule } from 'src/global'
import { MoviesModule } from '../movies.module'

describe('MoviesModule', () => {
    let app: INestApplication
    let server
    let createdMovieId: string

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
        it('creates a new movie', async () => {
            const movieDto = {
                title: 'The Shawshank Redemption',
                plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
                runningTimeInMinutes: 142,
                director: 'Frank Darabont',
                rated: 'R',
                genres: ['drama'],
                releaseDate: new Date('1994-09-22')
            }

            const response = await request(server).post('/movies').send(movieDto).expect(HttpStatus.CREATED)
            const movie = response.body

            expect(movie).toBeDefined()
            expect(movie.id).toBeDefined()
            expect(movie.title).toBe(movieDto.title)
            expect(movie.plot).toBe(movieDto.plot)
            expect(movie.runningTimeInMinutes).toBe(movieDto.runningTimeInMinutes)
            expect(movie.director).toBe(movieDto.director)
            expect(movie.rated).toBe(movieDto.rated)
            expect(movie.genres).toEqual(movieDto.genres)
            expect(new Date(movie.releaseDate)).toEqual(new Date(movieDto.releaseDate))

            createdMovieId = movie.id
        })
    })

    describe('/movies (GET)', () => {
        it('returns movies with query options', async () => {
            const queryDto = {
                order: 'title:desc',
                limit: 1,
                offset: 0,
                search: 'Redemption'
            }

            return request(server)
                .get('/movies')
                .query(queryDto)
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body.items)).toBeTruthy()
                    expect(res.body.items.length).toBe(1)
                    expect(res.body.items[0].title).toBe('The Shawshank Redemption')
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
                .get(`/movies/${createdMovieId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toEqual(createdMovieId)
                    expect(res.body.title).toBeDefined()
                })
        })

        it('returns a 404 error when the movie is not found', () => {
            return request(server).get('/movies/999').expect(404)
        })
    })

    describe('PATCH /movies/:id', () => {
        it('updates the movie with the given id', () => {
            return request(server)
                .patch(`/movies/${createdMovieId}`)
                .send({
                    title: 'Updated Movie'
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toEqual(createdMovieId)
                    expect(res.body.title).toEqual('Updated Movie')
                })
        })

        it('returns a 404 error when the movie is not found', () => {
            return request(server)
                .patch('/movies/999')
                .send({
                    title: 'Updated Movie'
                })
                .expect(404)
        })
    })

    describe('DELETE /movies/:id', () => {
        it('deletes the movie with the given id', () => {
            return request(server).delete(`/movies/${createdMovieId}`).expect(200)
        })

        it('returns a 404 error when the movie is not found', () => {
            return request(server).delete('/movies/999').expect(404)
        })
    })
})

// curl -X POST http://localhost:3000/movies -H 'Content-Type: application/json' -d '{ "title": "The Shawshank Redemption", "plot": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", "runningTimeInMinutes": 142, "director": "Frank Darabont", "rated": "R", "genres": ["drama"], "releaseDate": "1994-09-22T00:00:00.000Z" }'
