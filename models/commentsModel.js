const { checkExists } = require("../db/seeds/utils")
const db = require("../db/connection")

exports.selectCommentsByArticleId = (articleId)=>{
    return db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC', [articleId]).then(({rows})=>{
        return rows
    })
}

exports.insertNewComment = (articleId, newComment) =>{
    const {body, author} = newComment
    if(!body || !author){
        return Promise.reject({
            status: 400,
            msg: '400: missing required fields',
          });
    }
    else if(articleId){
        return checkExists("articles", "article_id", articleId).then(()=>{
            return db.query('INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;', [body, author, articleId]).then(({rows})=>{
                return rows[0]
            })
        })
    }
}

exports.deleteCommentById = (commentId)=>{
    return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *', [commentId]).then(({rows})=>{
        return rows[0]
    })
}