const express = require('express')
const { getTopics, getAllEndpoints } = require('./controllers/controller')


const app = express()

app.get('/api/topics', getTopics)

app.get('/api', getAllEndpoints)

app.use((err, req, res, next) => {
});

module.exports = app 