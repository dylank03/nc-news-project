const {selectTopics, insertTopic} = require('../models/topicsModel')

exports.getTopics = (req,res)=>{
    selectTopics().then((topics)=>{
        res.status(200).send({allTopics: topics})
    })
}

exports.postTopic = (req,res,next)=>{
    const newTopic = req.body

    insertTopic(newTopic).then((postedTopic)=>{
        res.status(201).send({topic: postedTopic})
    }).catch(next)
}