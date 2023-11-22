const request = require('supertest')
const app = require('../app')
const connection = require('../db/connection')
const testData = require('../db/data/test-data')
const seed = require('../db/seeds/seed')
const endpointsObject = require('../endpoints.json')
require('jest-sorted')

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

describe('endpoint GET /api/articles',()=>{
    test('receives 200 response and responds with all articles',()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body})=>{
            body.articles.forEach((article)=>{
                expect(article).toEqual(expect.objectContaining({ article_id: expect.any(Number), title: expect.any(String), topic: expect.any(String), author: expect.any(String), created_at: expect.any(String), votes: expect.any(Number), article_img_url: expect.any(String), comment_count: expect.any(String)}))
                expect(article.body).toBe(undefined)
            })
            expect(body.articles.length).toBe(testData.articleData.length)
            expect(body.articles).toBeSortedBy('created_at', {descending: true})
        })
    })
})
describe('endpoint GET /api/articles/:article_id',()=>{
    test('receives 200 response and returns correct article',()=>{
        return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then(({body})=>{
            console.log(body)
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
