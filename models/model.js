const db = require("../db/connection")


exports.selectTopics = ()=>{
    return db.query('SELECT * FROM topics').then(({rows})=>{
        return rows
    })
}

exports.selectAllArticles = ()=>{
    return db.query(`SELECT articles.article_id, articles.article_img_url, articles.author, articles.created_at, articles.title, articles.topic, articles.votes, COUNT(articles.article_id) AS comment_count
                     FROM articles
                     LEFT JOIN comments ON comments.article_id = articles.article_id
                     GROUP BY articles.article_id
                     ORDER BY articles.created_at DESC;
    `).then(({rows})=>{
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
    return db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC', [articleId]).then(({rows})=>{
        return rows
    })
}

exports.insertNewComment = (articleId, newComment) =>{
    const {body, author} = newComment
    return db.query('INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;', [body, author, articleId]).then(({rows})=>{
        return rows[0]
    })
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