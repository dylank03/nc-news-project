const { selectTopics, selectAllArticles, selectArticleById, selectCommentsByArticleId, insertNewComment } = require("../models/model")

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

exports.getAllArticles = (req, res)=>{
    selectAllArticles().then((articles)=>{
        res.status(200).send({articles})
    })
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