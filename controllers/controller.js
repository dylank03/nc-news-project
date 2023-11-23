const { selectTopics, selectAllArticles, selectArticleById } = require("../models/model")
const endpointsObject = require('../endpoints.json')

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

exports.postNewComment = (req,res)=>{
    
}