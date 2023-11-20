const request = require('supertest')
const app = require('../app')
const connection = require('../db/connection')
const testData = require('../db/data/test-data')
const seed = require('../db/seeds/seed')

afterAll(() => {
    return connection.end()
  })
  
beforeEach(() => {
    return seed(testData)
})

describe('endpoint GET /api/topics',()=>{
    test('receives 200 response', ()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
    })
    test('endpoint responds with an array of topic objects',()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body})=>{
            expect(body).toEqual([
                {
                  description: 'The man, the Mitch, the legend',
                  slug: 'mitch'
                },
                {
                  description: 'Not dogs',
                  slug: 'cats'
                },
                {
                  description: 'what books are made of',
                  slug: 'paper'
                }
              ])
        })
    })
    test("receives 404 for a route that isn't found",()=>{
        return request(app)
        .get('/api/topi')
        .expect(404)
    })
})