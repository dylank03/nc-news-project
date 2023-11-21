const { selectTopics, selectAllArticles } = require("../models/model")
const endpointsObject = require('../endpoints.json')

exports.getTopics = (req,res)=>{
    selectTopics().then((topics)=>{
        res.status(200).send({allTopics: topics})
    })
    .catch(next)
}

exports.getAllEndpoints = (req,res)=>{
    res.status(200).send({endpoints: endpointsObject})
}

exports.getAllArticles = (req, res)=>{
    selectAllArticles().then((articles)=>{
        res.status(200).send({articles})
    })
}