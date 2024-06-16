const { checkExists } = require("../db/seeds/utils")
const db = require("../db/connection")

exports.selectCommentsByArticleId = (articleId, limit = 10, p = 1)=>{

    if(/\D/.test(p) || /\D/.test(limit)){
        return Promise.reject({status:400, msg: 'Bad Request'})
    }

    const queryPromise = []

    queryPromise.push(db.query(`SELECT comments.*, users.avatar_url FROM comments JOIN users on comments.author = users.username WHERE article_id = $1 ORDER BY created_at DESC LIMIT ${limit} OFFSET ${p*limit - limit}`, [articleId]).then(({rows})=>{
        return rows
    }))

    queryPromise.push(db.query(`SELECT CAST(COUNT(comments) AS INT) FROM comments WHERE article_id = $1`, [articleId]).then(({rows})=>{
        return rows[0].count
    }))

    return Promise.all(queryPromise)
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

exports.updateCommentVotes = (commentId, newVoteCount)=>{
    if(!newVoteCount){
        return Promise.reject({
            status: 400,
            msg: '400: Invalid Input',
        });
    }
    return db.query('UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;', [newVoteCount, commentId]).then(({rows})=>{
        return rows[0]
    })
}