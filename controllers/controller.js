const { selectTopics, selectArticleById, selectCommentsByArticleId } = require("../models/model")
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