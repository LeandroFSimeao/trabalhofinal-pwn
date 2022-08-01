const express = require('express')
const secRouter = express.Router()

const knex = require('knex') ({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        },
    }
})

secRouter.post ('/login', express.json(), (req, res) => {

})

module.exports = secRouter;