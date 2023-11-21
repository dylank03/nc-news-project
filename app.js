const express = require('express')
const { getTopics, getAllEndpoints, getAllArticles } = require('./controllers/controller')


const app = express()

app.get('/api/topics', getTopics)

app.get('/api', getAllEndpoints)

app.get('/api/articles', getAllArticles)

app.use((err, req, res, next) => {
});

module.exports = app 