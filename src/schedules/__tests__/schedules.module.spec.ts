import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { DatabaseModule } from 'src/database'
import { SchedulesModule } from '../schedules.module'

describe('SchedulesModule', () => {
    let app: INestApplication
    let server
    let scheduleId: string

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [DatabaseModule, SchedulesModule]
        }).compile()

        app = module.createNestApplication()
        await app.init()

        server = app.getHttpServer()
    })

    afterAll(async () => {
        await app.close()
    })

    describe('POST /schedules', () => {
        it('creates a new schedule', () => {
            return request(server)
                .post('/schedules')
                .send({
                    name: 'Schedule 1'
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body.id).toBeDefined()
                    expect(res.body.name).toEqual('Schedule 1')

                    scheduleId = res.body.id
                })
        })
    })

    describe('/schedules (GET)', () => {
        it('returns schedules with query options', async () => {
            const queryDto = {
                order: 'name:desc',
                limit: 1,
                offset: 0,
                search: 'Schedule 1'
            }

            return request(server)
                .get('/schedules')
                .query(queryDto)
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body.items)).toBeTruthy()
                    expect(res.body.items.length).toBe(1)
                    expect(res.body.items[0].name).toBe('Schedule 1')
                    expect(typeof res.body.offset).toBe('number')
                    expect(typeof res.body.limit).toBe('number')
                    expect(typeof res.body.total).toBe('number')
                })
        })

        it('returns schedules with default options', async () => {
            return request(server)
                .get('/schedules')
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

    describe('GET /schedules/:id', () => {
        it('returns the schedule with the given id', () => {
            return request(server)
                .get(`/schedules/${scheduleId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toEqual(scheduleId)
                    expect(res.body.name).toBeDefined()
                })
        })

        it('returns a 404 error when the schedule is not found', () => {
            return request(server).get('/schedules/999').expect(404)
        })
    })

    describe('PATCH /schedules/:id', () => {
        it('updates the schedule with the given id', () => {
            return request(server)
                .patch(`/schedules/${scheduleId}`)
                .send({
                    name: 'Updated Schedule'
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toEqual(scheduleId)
                    expect(res.body.name).toEqual('Updated Schedule')
                })
        })

        it('returns a 404 error when the schedule is not found', () => {
            return request(server)
                .patch('/schedules/999')
                .send({
                    name: 'Updated Schedule'
                })
                .expect(404)
        })
    })

    describe('DELETE /schedules/:id', () => {
        it('deletes the schedule with the given id', () => {
            return request(server).delete(`/schedules/${scheduleId}`).expect(200)
        })

        it('returns a 404 error when the schedule is not found', () => {
            return request(server).delete('/schedules/999').expect(404)
        })
    })
})
