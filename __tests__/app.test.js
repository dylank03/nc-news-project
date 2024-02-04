const request = require('supertest')
const app = require('../app')
const connection = require('../db/connection')
const testData = require('../db/data/test-data')
const seed = require('../db/seeds/seed')
const endpointsObject = require('../endpoints.json')
const { convertTimestampToDate, formatComments } = require('../db/seeds/utils')
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
                expect(article).toEqual(expect.objectContaining({ article_id: expect.any(Number), title: expect.any(String), topic: expect.any(String), author: expect.any(String), created_at: expect.any(String), votes: expect.any(Number), article_img_url: expect.any(String), comment_count: expect.any(Number)}))
                expect(article.body).toBe(undefined)
            })
            expect(body.articles.length).toBe(10)
            expect(body.articles).toBeSortedBy('created_at', {descending: true})
        })
    })
})

describe('endpoint GET /api/articles/:article_id',()=>{
    test('receives 200 response and returns correct article with comment count',()=>{
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
            votes: 0, comment_count: 0 })
        })
    })
    test('receives 200 response and returns correct article with comment count',()=>{
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body})=>{
                expect(body.article).toEqual( {
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: expect.any(String),
                    votes: 100,
                    article_img_url:
                      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700", comment_count: 11
                  })
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
            expect(body.comments).toEqual([{
                comment_id: 11,
                body: "Ambidextrous marsupial",
                votes: 0,
                author: "icellusedkars",
                article_id: 3,
                created_at: "2020-09-19T23:10:00.000Z",
              },{
                comment_id: 10,
                body: "git push origin master",
                votes: 0,
                author: "icellusedkars",
                article_id: 3,
                created_at: "2020-06-20T07:24:00.000Z",
              }]
)
              expect(body.comments).toBeSortedBy('created_at', {descending: true})
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

describe('endpoint POST /api/articles/:article_id/comments',()=>{
    test('receives 201 response and returns the posted comment', ()=>{
        return request(app)
        .post('/api/articles/3/comments').send({body: "This is a new comment", author: "icellusedkars"})
        .expect(201)
        .then(({body})=>{
            expect(body.comment).toEqual( {
                comment_id: 19,
                body: "This is a new comment",
                votes: 0,
                author: "icellusedkars",
                article_id: 3,
                created_at: expect.any(String)
              })
        })
    })
    test('returns 400 for invalid id',()=>{
        return request(app)
        .post('/api/articles/notavalidID/comments')
        .expect(400)
    })
    test('receives 400 response for missing properties', ()=>{
        return request(app)
        .post('/api/articles/3/comments').send({})
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('400: missing required fields')
        })
    })
    test('returns 404 for article ID that does not exist', ()=>{
        return request(app)
        .post('/api/articles/99999/comments').send({body: "This is a new comment", author: "icellusedkars"})
        .expect(404)
    })
})

describe('endpoint PATCH /api/articles/:article_id',()=>{
    test('receives 200 response and responds with the updated article',()=>{
        return request(app)
        .patch('/api/articles/2').send({inc_votes : 1})
        .expect(200)
        .then(({body})=>{
            expect(body.article).toEqual(  {
                article_id: 2,
                title: "Sony Vaio; or, The Laptop",
                topic: "mitch",
                author: "icellusedkars",
                body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                created_at: "2020-10-16T05:03:00.000Z",
                votes: 1,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              })
        })
    })
    test('returns 400 for invalid request body',()=>{
        return request(app)
        .patch('/api/articles/2').send({})
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('400: Invalid Input')
        })
    })
    test('returns 400 for invalid request body',()=>{
        return request(app)
        .patch('/api/articles/2').send({inc_votes: 'number'})
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('400: Invalid Input')
        })
    })
    test('returns 404 error for article ID that is not found', ()=>{
        return request(app)
        .patch('/api/articles/99999').send({inc_votes : 1})
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('not found')
        })
    })
})

describe('endpoint DELETE /api/comments/:comment_id', ()=>{
    test('receives 204 and responds with no content', ()=>{
        return request(app)
        .delete('/api/comments/6')
        .expect(204).then(({body})=>{
            expect(body).toEqual({})
        })
    })
    test('receives 400 if given invalid ID', ()=>{
        return request(app)
        .delete('/api/comments/InvalidId')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('400: Invalid Input')
        })
    })
    test('receives 404 if given comment ID that does not exist', ()=>{
        return request(app)
        .delete('/api/comments/9999999')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('not found')
        })
    })
})

describe('endpoint GET /api/users', ()=>{
    test('receives 200 response and responds with array of all users', ()=>{
        return request(app)
        .get('/api/users')
        .expect(200).then(({body})=>{
            expect(body.users).toEqual(testData.userData)
        })
    })
})

describe('endpoint GET /api/articles (topic query)', ()=>{
    test('receives 200 response and responds with articles filtered by the topic value specified in the query', ()=>{
        return request(app)
        .get('/api/articles?category=cats')
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toMatchObject( [{
                article_id:5,
                title: "UNCOVERED: catspiracy to bring down democracy",
                topic: "cats",
                author: "rogersop",
                comment_count: 2,
                created_at: expect.any(String),
                votes: 0,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              }])  
        })
    })
    test('receives 200 response and responds with articles filtered by the topic value specified in the query', ()=>{
        return request(app)
        .get('/api/articles?category=mitch')
        .expect(200)
        .then(({body})=>{
            body.articles.forEach((article)=>{
                expect(article).toMatchObject({article_id: expect.any(Number), article_img_url: expect.any(String), author: expect.any(String), created_at: expect.any(String), title: expect.any(String), topic: 'mitch', votes: expect.any(Number), comment_count: expect.any(Number)})
            })
            expect(body.articles.length).toBeGreaterThan(0)
        })
    })
    // test('receives 404 for a topic that does not exist', ()=>{
    //     return request(app)
    //     .get('/api/articles?topic=unknown')
    //     .expect(404)
    //     .then(({body})=>{
    //         expect(body.msg).toBe('not found')
    //     })
    // })
    test('receives 200 for a topic that does exist but has no articles associated', ()=>{
        return request(app)
        .get('/api/articles?category=paper')
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toEqual([])
        })
    })
})

describe('endpoint GET /api/articles (sort query)', ()=>{
    test('receives 200 response and responds with articles sorted by sort value given in query', ()=>{
        return request(app)
        .get('/api/articles?sort_by=votes')
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toBeSortedBy('votes', {descending:true})
        })
    })
    test('receives 200 response and responds with articles sorted by sort value given in query', ()=>{
        return request(app)
        .get('/api/articles?sort_by=author')
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toBeSortedBy('author', {descending:true})
        })
    })
    test('receives 200 response and responds with articles sorted by sort value given in query', ()=>{
        return request(app)
        .get('/api/articles?sort_by=title')
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toBeSortedBy('title', {descending:true})
        })
    })
    test('receives 200 response and responds with articles ordered by order value given in query', ()=>{
        return request(app)
        .get('/api/articles?sort_by=votes&order_by=asc')
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toBeSortedBy('votes', {ascending:true})
        })
    })
    test('receives 200 response and responds with articles ordered by order value given in query', ()=>{
        return request(app)
        .get('/api/articles?sort_by=author&order_by=asc')
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toBeSortedBy('author', {ascending:true})
        })
    })
    test('receives 200 response and responds with articles ordered by order value given in query', ()=>{
        return request(app)
        .get('/api/articles?sort_by=title&order_by=asc')
        .expect(200)
        .then(({body})=>{
            expect(body.articles).toBeSortedBy('title', {ascending:true})
        })
    })
    test('Invalid sort query returns 400 error with bad request message', ()=>{
        return request(app)
        .get('/api/articles?sort_by=something')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('invalid order query returns 400 error with bad request message', ()=>{
        return request(app)
        .get('/api/articles?order_by=whatever', ()=>{
            expect(400)
            .then(({body})=>{
                expect(body.msg).toBe('Bad Request')
            })
        })
    })
})

describe('endpoint GET /api/users/:username', ()=>{
    test('receives 200 response and responds with correct user object for username', ()=>{
        return request(app)
        .get('/api/users/icellusedkars')
        .expect(200)
        .then(({body})=>{
            expect(body.user).toEqual({
                username: 'icellusedkars',
                name: 'sam',
                avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
              })
        })
    })
    test('receives 404 and responds with not found for invalid username', ()=>{
        return request(app)
        .get('/api/users/noname')
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('not found')
        })
    } )
})

describe('endpoint PATCH api/comments/:comment_id', ()=>{
    test('receives 200 response and updates votes for given comment ID', ()=>{
        return request(app)
        .patch('/api/comments/4').send({inc_votes: 10})
        .expect(200)
        .then(({body})=>{
            expect(body.comment).toMatchObject(  {
                body: " I carry a log — yes. Is it funny to you? It is not to me.",
                votes: -90,
                author: "icellusedkars",
                article_id: 1,
                comment_id:4,
                created_at: expect.any(String)
              })
        })
    })
    test('receives 400 for invalid request', ()=>{
        return request(app)
        .patch('/api/comments/invalidId').send({inc_votes:7})
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('400: Invalid Input')
        })
    })
    test('receives 404 if commentId does not exist', ()=>{
        return request(app)
        .patch('/api/comments/999999').send({inc_votes: 8})
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe('not found')
        })
    })
    test('receives 400 if there is no request body' , ()=>{
        return request(app)
        .patch('/api/comments/9')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('400: Invalid Input')
        })
    })
})

describe('endpoint POST /api/articles', ()=>{
    test('receives 200 status code and responds with posted article', ()=>{
        return request(app)
        .post('/api/articles').send({author: 'icellusedkars', title: 'New Article', body: 'This is a new article', topic: 'cats', article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"})
        .expect(201)
        .then(({body})=>{
            expect(body.article).toMatchObject({author: 'icellusedkars', title: 'New Article', body: 'This is a new article', topic: 'cats', article_id: expect.any(Number), votes:0, created_at: expect.any(String), comment_count:0, article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"})
        })
    })
    test('receives 200 and responds with posted article with default image when no image url is given', ()=>{
        return request(app)
        .post('/api/articles').send({author: 'icellusedkars', title: 'New Article', body: 'This is a new article', topic: 'cats',})
        .expect(201)
        .then(({body})=>{
            expect(body.article).toMatchObject({author: 'icellusedkars', title: 'New Article', body: 'This is a new article', topic: 'cats', article_id: expect.any(Number), votes:0, created_at: expect.any(String), comment_count:0, article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"})
        })
    })
    test('receives 400 when given invalid request body', ()=>{
        return request(app)
        .post('/api/articles').send({author: 'icellusedkars', body: 'This is a new article', topic: 'cats',})
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('400: missing required fields')
        })
    })
})

describe('endpoint GET /api/articles (pagination)', ()=>{
    test('receives 200 status code and responds with first 5 articles orderd by date', ()=>{
        return request(app)
        .get('/api/articles?p=1&limit=5')
        .expect(200)
        .then(({body})=>{
            body.articles.forEach((article)=>{
                expect(article).toEqual(expect.objectContaining({ article_id: expect.any(Number), title: expect.any(String), topic: expect.any(String), author: expect.any(String), created_at: expect.any(String), votes: expect.any(Number), article_img_url: expect.any(String), comment_count: expect.any(Number)}))
                expect(article.body).toBe(undefined)
            })
            expect(body.articles.length).toBe(5)
            expect(body.articles).toBeSortedBy('created_at', {descending: true})
        })
    })
    test('receives 200 status code and responds with next 5 articles ordered by date', ()=>{
        return request(app)
        .get('/api/articles?p=2&limit=5')
        .expect(200)
        .then(({body})=>{
            body.articles.forEach((article)=>{
                expect(article).toEqual(expect.objectContaining({ article_id: expect.any(Number), title: expect.any(String), topic: expect.any(String), author: expect.any(String), created_at: expect.any(String), votes: expect.any(Number), article_img_url: expect.any(String), comment_count: expect.any(Number)}))
                expect(article.body).toBe(undefined)
            })
            expect(body.articles[0].created_at).toBe('2020-08-03T13:14:00.000Z')
            expect(body.article_count).toBe('13')
            expect(body.articles.length).toBe(5)
            expect(body.articles).toBeSortedBy('created_at', {descending: true})
        })
    })
    test('receives 400 status code for bad request', ()=>{
        return request(app)
        .get('/api/articles?p=2&limit=dropdatabase')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('receives 400 status code for bad request', ()=>{
        return request(app)
        .get('/api/articles?p=hahahaha&limit=6')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Bad Request')
        })
    })
})