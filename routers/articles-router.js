const articlesRouter = require('express').Router()
const {getAllArticles , getArticleById, patchArticleVotes, postNewArticle} = require('../controllers/articlesController')
const { getArticleComments, postNewComment } = require('../controllers/commentsController')

articlesRouter
    .route('/')
    .get(getAllArticles)
    .post(postNewArticle)

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchArticleVotes)

articlesRouter
    .route('/:article_id/comments')
    .get(getArticleComments)
    .post(postNewComment)

module.exports = articlesRouter