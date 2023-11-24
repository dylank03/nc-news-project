const db = require("../db/connection")
const { checkExists } = require("../db/seeds/utils")


exports.selectTopics = ()=>{
    return db.query('SELECT * FROM topics').then(({rows})=>{
        return rows
    })
}

exports.selectAllArticles = (topicQuery)=>{
    const queryValues = []
    let queryString = `SELECT articles.article_id, articles.article_img_url, articles.author, articles.created_at, articles.title, articles.topic, articles.votes, COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
     `

    if(topicQuery){
        queryValues.push(topicQuery)
        queryString += ` WHERE topic = $1`
    }

    return db.query(queryString + `GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`, queryValues).then(({rows})=>{
        return rows
    })
}
exports.selectArticleById = (articleId)=>{
    return db.query(`SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles 
                    LEFT JOIN comments ON comments.article_id = articles.article_id
                    WHERE articles.article_id = $1
                    GROUP BY articles.article_id`, [articleId]).then(({rows})=>{
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


exports.updateArticleVotes = (articleId, newVoteCount) =>{
    if(!newVoteCount){
        return Promise.reject({
            status: 400,
            msg: '400: Invalid Input',
        });
    }
    return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;', [newVoteCount, articleId]).then(({rows})=>{
        return rows[0]
    })
}

exports.deleteCommentById = (commentId)=>{
    return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *', [commentId]).then(({rows})=>{
        return rows[0]
    })
}

exports.selectAllUsers = ()=>{
    return db.query('SELECT * FROM users').then(({rows})=>{
        return rows
    })
}