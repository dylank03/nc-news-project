const db = require("../db/connection")

exports.selectAllArticles = (topicQuery, sortByQuery = 'created_at', orderByQuery = 'DESC')=>{
    const queryValues = []
    const validSortQueries = ['title', 'topic', 'author', 'body', 'created_at', 'votes']
    const validOrderQueries = ['ASC', 'DESC']
    let queryString = `SELECT articles.article_id, articles.article_img_url, articles.author, articles.created_at, articles.title, articles.topic, articles.votes, CAST(COUNT(comments.article_id) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    `
    if(topicQuery){
        queryValues.push(topicQuery)
        queryString += ` WHERE articles.topic = $1`
    }
    
    if(!validSortQueries.includes(sortByQuery.toLowerCase())){
        return Promise.reject({status:400, msg: 'Bad Request'})
    }

    if(!validOrderQueries.includes(orderByQuery.toUpperCase())){
        return Promise.reject({status:400, msg: 'Bad Request'})
    }

    return db.query(queryString + `GROUP BY articles.article_id
    ORDER BY articles.${sortByQuery.toLowerCase()} ${orderByQuery.toUpperCase()}`, queryValues).then(({rows})=>{
        return rows
    })
}


exports.selectArticleById = (articleId)=>{
    return db.query(`SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles 
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

exports.insertNewArticle = (newArticle) =>{
    const {body, author, title, topic} = newArticle
    const article_img_url = newArticle.article_img_url || "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
    if(!body || !author || !title || !topic){
        return Promise.reject({
            status: 400,
            msg: '400: missing required fields',
          });
    }
    else{
        return db.query('INSERT INTO articles (body, author, title, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *;', [body, author, title, topic, article_img_url]).then(({rows})=>{
            const articleId = rows[0].article_id
            return db.query(`SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count FROM articles 
                    LEFT JOIN comments ON comments.article_id = articles.article_id
                    WHERE articles.article_id = $1
                    GROUP BY articles.article_id`, [articleId]).then(({rows})=>{
                        return rows[0]
                    })
        })
    }
}


