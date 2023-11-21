const express = require('express')
const { getTopics, getAllEndpoints, getArticleById, getArticleComments} = require('./controllers/controller')


const app = express()

app.get('/api/topics', getTopics)

app.get('/api', getAllEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getArticleComments)

app.use((err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
  });

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg: '400: Invalid Input'});
    }
});

module.exports = app 