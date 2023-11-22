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

