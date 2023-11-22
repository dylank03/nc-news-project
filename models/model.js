const db = require("../db/connection")


exports.selectTopics = ()=>{
    return db.query('SELECT * FROM topics').then(({rows})=>{
        return rows
    })
}

exports.selectArticleById = (articleId)=>{
    return db.query('SELECT * FROM articles WHERE article_id = $1', [articleId]).then(({rows})=>{
        if (!rows.length) {
            return Promise.reject({
              status: 404,
              msg: '404: Article not found',
            });
          }
        return rows[0]
    })
}

exports.selectCommentsByArticleId = (articleId)=>{
    return db.query('SELECT * FROM comments WHERE article_id = $1', [articleId]).then(({rows})=>{
        return rows
    })
}