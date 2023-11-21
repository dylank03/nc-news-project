const db = require("../db/connection")

exports.selectTopics = ()=>{
    return db.query('SELECT * FROM topics').then(({rows})=>{
        return rows
    })
}

exports.selectAllArticles = ()=>{
    return db.query('SELECT * FROM articles').then(({rows})=>{
        return rows
    })
}