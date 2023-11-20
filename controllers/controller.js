const { selectTopics } = require("../models/model")

exports.getTopics = (req,res)=>{
    selectTopics().then((topics)=>{
        res.status(200).send({allTopics: topics})
    })
    .catch(next)
}