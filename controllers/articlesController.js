const {selectAllArticles, selectArticleById, updateArticleVotes, insertNewArticle } = require("../models/articlesModel")

const { checkExists } = require("../db/seeds/utils")

exports.getAllArticles = (req, res, next)=>{
    const {category, sort_by, order_by, limit, p} = req.query
    const articlePromises = [selectAllArticles(category, sort_by, order_by, limit, p)]
    
    Promise.all(articlePromises).then((resolvedPromises)=>{
        const filteredArticles = resolvedPromises[0][0]
        res.status(200).send({articles: filteredArticles, article_count: resolvedPromises[0][1]})
    }).catch(next)
}

exports.getArticleById = (req, res, next)=>{
    const {article_id} = req.params
    selectArticleById(article_id).then((article)=>{
        res.status(200).send({article})
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

exports.postNewArticle = (req,res, next)=>{
    const articleData = req.body
    insertNewArticle(articleData).then((newArticle)=>{
        res.status(201).send({article: newArticle})
    }).catch(next)
}