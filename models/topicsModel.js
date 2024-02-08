const db = require("../db/connection")

exports.selectTopics = ()=>{
    return db.query('SELECT * FROM topics').then(({rows})=>{
        return rows
    })
}

exports.insertTopic = (newTopic)=>{
    const {slug, description} = newTopic
    if(!slug || !description){
        return Promise.reject({
            status: 400,
            msg: '400: missing required fields',
          });
    }
    else{
        return db.query(`INSERT INTO topics VALUES ($1, $2) RETURNING *`, [slug, description]).then(({rows})=>{
            return rows[0]
        })
    }
}