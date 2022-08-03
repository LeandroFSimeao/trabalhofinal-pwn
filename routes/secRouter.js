const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { json } = require('express')

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
    let user = req.body.login
    let pass = req.body.senha

knex
    .select('*')
    .from('usuario')
    .where({login: user})
    .then ((usuarios) => {
            if (usuarios.length){ 
                let usuario = usuarios[0]
                let checksenha = bcrypt.compareSync (pass, usuario.senha)
                if (checksenha) {
                    let token = jwt.sign({id: usuario.id}, process.env.SECRET_KEY, {expiresIn: 300})
                    res.status(200).json({
                        id: usuario.id,
                        token: token
                    })
                    res.end()
                }
                else{
                    res.status(401).json({message:"Usuario ou senha incorretos."})
                    res.end()
                }
            }
            else{
                res.status(401).json({message:"Usuario ou senha incorretos."})
                res.end()
            }
    })
    .catch(err => res.status(500).json({message: `Erro ao verificar login: ${err.message}` }))
});

secRouter.post ('/register', express.json(), (req, res) => {
    knex('usuario')
        .insert({
            nome: req.body.nome,
            email: req.body.email,
            login: req.body.login,
            senha: bcrypt.hashSync(req.body.senha, 8)},
            ['id'])
        .then (result => {
            let usuario = result[0]
            res.status(200).json ({ "id": usuario.id })
            return
        })
        .catch (err => res.status(500).json ({ message: `Erro ao registrar usuario ${err.message}`}))

});

module.exports = secRouter;