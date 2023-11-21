const request = require('supertest')
const app = require('../app')
const connection = require('../db/connection')
const testData = require('../db/data/test-data')
const seed = require('../db/seeds/seed')
const endpointsObject = require('../endpoints.json')

afterAll(() => {
    return connection.end()
  })
  
beforeEach(() => {
    return seed(testData)
})

describe('endpoint GET /api/topics',()=>{
    test('endpoint responds with an array of topic objects',()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body})=>{
           testData.topicData.forEach((topic, index) =>{
              expect(body.allTopics[index]).toMatchObject(topic)
          })
        })
    })
    test("receives 404 for a route that isn't found",()=>{
        return request(app)
        .get('/api/topi')
        .expect(404)
    })
})

describe('endpoint GET /api',()=>{
    test('receives 200 response and endpoints json object',()=>{
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body})=>{
            expect(body.endpoints).toEqual(endpointsObject)
        })
    })
})

describe('endpoint GET /api/articles/:article_id',()=>{
    test('receives 200 response and returns correct article',()=>{
        return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then(({body})=>{
            expect(body.article.article_id).toBe(2)
            expect(Object.keys(body.article).length).toBe(8)
        })
    })
    test('receives 400 response for a bad user ID and responds with an error message', () => {
        return request(app)
          .get('/api/articles/notAnID')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('400: Invalid Input');
          });
      });
      test("receives 404 for an ID that isn't found",()=>{
        return request(app)
        .get('/api/articles/999999')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('404: Article not found')
        })
    })
})