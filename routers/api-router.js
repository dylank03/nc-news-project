const apiRouter = require('express').Router()
const {getAllEndpoints} = require('../controllers/endpointsController')

apiRouter.get('/', getAllEndpoints)

module.exports = apiRouter