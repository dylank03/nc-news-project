const commentsRouter = require('express').Router()
const {deleteComment} = require('../controllers/commentsController')

commentsRouter.delete('/:comment_id', deleteComment)

module.exports = commentsRouter