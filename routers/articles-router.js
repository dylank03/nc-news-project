const articlesRouter = require('express').Router()
const {getAllArticles , getArticleById, patchArticleVotes} = require('../controllers/articlesController')
const { getArticleComments, postNewComment } = require('../controllers/commentsController')

articlesRouter.get('/', getAllArticles)

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchArticleVotes)

articlesRouter
    .route('/:article_id/comments')
    .get(getArticleComments)
    .post(postNewComment)

module.exports = articlesRouter