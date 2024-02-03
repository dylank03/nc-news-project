const commentsRouter = require('express').Router()
const {deleteComment, patchCommentVotes} = require('../controllers/commentsController')

commentsRouter
    .route('/:comment_id')
    .delete(deleteComment)
    .patch(patchCommentVotes)


module.exports = commentsRouter