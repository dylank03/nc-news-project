const express = require('express')
const { getTopics, getAllEndpoints, getAllArticles , getArticleById, getArticleComments, postNewComment, patchArticleVotes, deleteComment, getAllUsers} = require('./controllers/controller')
const cors = require ('cors');

const app = express()

app.use(cors())

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', getAllEndpoints)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments', getArticleComments)

app.post('/api/articles/:article_id/comments', postNewComment)

app.delete('/api/comments/:comment_id', deleteComment)

app.patch('/api/articles/:article_id', patchArticleVotes)

app.get('/api/users', getAllUsers)


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