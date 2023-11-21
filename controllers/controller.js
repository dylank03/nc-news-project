const { selectTopics, selectArticleById } = require("../models/model")
const endpointsObject = require('../endpoints.json')

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

exports.getArticleComments = (req,res)=>{
    res.status(200).send({})
}