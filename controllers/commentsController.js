const {selectCommentsByArticleId, insertNewComment, deleteCommentById, updateCommentVotes} = require('../models/commentsModel')
const { checkExists } = require("../db/seeds/utils");

exports.getArticleComments = (req,res, next)=>{
    const {article_id} = req.params
    const {limit, p} = req.query
    checkExists("articles", "article_id", article_id).then(() => {
        selectCommentsByArticleId(article_id, limit, p).then((comments)=>{
            res.status(200).send({ comments: comments[0], commentCount: comments[1] });
        }).catch(next) 
    }).catch(next)
}

exports.postNewComment = (req,res, next)=>{
    const {article_id} = req.params
    const commentData = req.body
        insertNewComment(article_id, commentData).then((newComment)=>{
            res.status(201).send({comment: newComment})
    }).catch(next)
}

exports.deleteComment = (req, res, next)=>{
    const {comment_id} = req.params
    return checkExists("comments", "comment_id", comment_id).then(()=>{
        return deleteCommentById(comment_id)
    }).then(()=>{
        res.status(204).send()
    }).catch(next)
}

exports.patchCommentVotes = (req, res, next)=>{
    const {comment_id} = req.params
    const {inc_votes} = req.body
    return checkExists("comments", "comment_id", comment_id).then(()=>{
        return updateCommentVotes(comment_id, inc_votes)
    }).then((comment)=>{
        res.status(200).send({comment})
    }).catch(next)
}