const {selectTopics} = require('../models/topicsModel')

exports.getTopics = (req,res)=>{
    selectTopics().then((topics)=>{
        res.status(200).send({allTopics: topics})
    })
}