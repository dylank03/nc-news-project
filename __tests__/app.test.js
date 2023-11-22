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
            expect(body.article).toEqual({article_id: 2, 
            title: "Sony Vaio; or, The Laptop", 
            topic: "mitch",
            author: "icellusedkars",
            body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            created_at: "2020-10-16T05:03:00.000Z",
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            votes: 0 })
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

describe('endpoint GET /api/articles/:article_id/comments',()=>{
    test('receives 200 response and commments for given article_id',()=>{
        return request(app)
        .get('/api/articles/3/comments')
        .expect(200)
        .then(({body})=>{
            const date = new Date(1600560600000)
            expect(body.comments).toEqual(  [{
                comment_id: 10,
                body: "git push origin master",
                votes: 0,
                author: "icellusedkars",
                article_id: 3,
                created_at: "2020-06-20T07:24:00.000Z",
              },
              {
                comment_id: 11,
                body: "Ambidextrous marsupial",
                votes: 0,
                author: "icellusedkars",
                article_id: 3,
                created_at: "2020-09-19T23:10:00.000Z",
              }])
        })
    })
    test('returns 404 error for id that is not found', ()=>{
        return request(app)
        .get('/api/articles/99999/comments')
        .expect(404)
    })
    test('returns 400 for invalid id',()=>{
        return request(app)
        .get('/api/articles/notavalidID/comments')
        .expect(400)
    })
    test('returns empty array for valid article with no comments associated',()=>{
        return request(app)
        .get('/api/articles/7/comments')
        .expect(200)
        .then(({body})=>{
            expect(body.comments).toEqual([])
        })
    })
})