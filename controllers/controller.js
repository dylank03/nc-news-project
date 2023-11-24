const { selectTopics, selectAllArticles, selectArticleById, selectCommentsByArticleId, insertNewComment, updateArticleVotes, deleteCommentById, selectAllUsers } = require("../models/model")

const endpointsObject = require('../endpoints.json')
const { checkExists } = require("../db/seeds/utils")


exports.getTopics = (req,res)=>{
    selectTopics().then((topics)=>{
        res.status(200).send({allTopics: topics})
    })
}

exports.getAllEndpoints = (req,res)=>{
    res.status(200).send({endpoints: endpointsObject})
}

exports.getAllArticles = (req, res, next)=>{
    const {topic} = req.query
    const articlePromises = [selectAllArticles(topic)]

    if(topic){
        articlePromises.push(checkExists("topics", "slug", topic))
    }

    Promise.all(articlePromises).then((resolvedPromises)=>{
        const filteredArticles = resolvedPromises[0]
        res.status(200).send({articles: filteredArticles})
    }).catch(next)
}

exports.getArticleById = (req, res, next)=>{
    const {article_id} = req.params
    selectArticleById(article_id).then((article)=>{
        res.status(200).send({article})
    }).catch(next)
}

exports.getArticleComments = (req,res, next)=>{
    const {article_id} = req.params
    checkExists("articles", "article_id", article_id).then(() => {
        selectCommentsByArticleId(article_id).then((comments)=>{
            res.status(200).send({ comments });
        }) 
    })
    .catch(next);
}

exports.postNewComment = (req,res, next)=>{
    const {article_id} = req.params
    const commentData = req.body
        insertNewComment(article_id, commentData).then((newComment)=>{
            res.status(201).send({comment: newComment})
    }).catch(next)
}

exports.patchArticleVotes = (req,res, next)=>{
    const {inc_votes} = req.body
    const {article_id} = req.params
    articlePromises = [updateArticleVotes(article_id, inc_votes)]
    articlePromises.push(checkExists("articles", "article_id", article_id))
    return Promise.all(articlePromises).then((resolvedPromises)=>{
        const updatedArticle = resolvedPromises[0]
        res.status(200).send({article: updatedArticle})
    }).catch(next)
}

exports.deleteComment = (req, res, next)=>{
    const {comment_id} = req.params
    const commentPromises = [deleteCommentById(comment_id)]
    commentPromises.push(checkExists("comments", "comment_id", comment_id))
    Promise.all(commentPromises).then((resolvedPromises)=>{
        const deletedComment = resolvedPromises[0]
        res.status(204).send()
    }).catch(next)
}

exports.getAllUsers = (req, res)=>{
    selectAllUsers().then((users)=>{
        res.status(200).send({users})
    })
}