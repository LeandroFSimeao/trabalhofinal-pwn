const express = require('express')
const clientRouter = express.Router ()

clientRouter.use (express.static('public'))

module.exports = clientRouter