const express = require('express')

const articlesRouter = require('./routers/articles-router');
const commentsRouter = require('./routers/comments-router');
const apiRouter = require('./routers/api-router');
const topicsRouter = require('./routers/topics-router');
const userRouter = require('./routers/users-router');
const cors = require ('cors');


const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/articles', articlesRouter)
app.use('/api/comments', commentsRouter)
app.use('/api', apiRouter)
app.use('/api/topics', topicsRouter)
app.use('/api/users', userRouter)

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