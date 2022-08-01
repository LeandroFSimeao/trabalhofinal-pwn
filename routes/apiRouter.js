require('dotenv').config();
const express = require('express')
const jwt = require('jsonwebtoken')
const apiRouter = express.Router()

const knex = require('knex') ({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        },
    }
})

const checkToken = (req, res, next) =>{ 
    let authHeader = req.get('Authorization')
    if(!authHeader){
        res.status(403).json({message: 'Token requerida'});
        res.end();
    } else{
        let token = authHeader.split(' ')[1]
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
            if (err) {
                res.status(401).json({message: 'Token inválida'})
                res.end()
            }
            else{
                req.token = decodedToken;
                req.userId = decodedToken.id;
                next()
            }
        })
    }
}

const isAdmin = (req, res, next) => { //2:38
    knex 
        .select ('*').from ('usuario').where({ id: req.userId }) 
        .then ((usuarios) => { 
            if (usuarios.length) { 
                let usuario = usuarios[0] 
                let roles = usuario.roles.split(';') 
                let adminRole = roles.find(i => i === 'ADMIN') 
                if (adminRole === 'ADMIN') { 
                    next() 
                    return 
                } 
                else { 
                    res.status(403).json({ message: 'Role de ADMIN requerida' }) 
                    return 
                } 
            } 
        }) 
        .catch (err => { 
            res.status(500).json({  
              message: 'Erro ao verificar roles de usuário - ' + err.message }) 
        }) 
}

//Lista filmes

apiRouter.get('/filmes', function (req, res) {

    knex
        .select("*")
        .from("filmes")
        .then(filmes => res.status(200).json(filmes))
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao recuperar filmes - ' + err.message
            })
        })
})

//Lista filme por id

apiRouter.get('/filmes/:id', checkToken, function (req, res) {
    let id = Number.parseInt(req.params.id);
    
    if (id > 0) {
        knex
          .select("*")
          .from("filmes")
          .where('id', id)
          .then(filmes => res.status(200).json(filmes))
          .catch(err => {
            res.status(500).json({
                message: 'Erro ao recuperar filmes - ' + err.message
            })
        })
    } else {
        res.status(404).json({
            message: "filme não encontrado"
        })
    }
})

//Cria novo filme

apiRouter.post('/filmes', express.json(), checkToken, isAdmin, function (req, res){
    knex('filmes')
        .insert({
            titulo: req.body.titulo,
            diretor: req.body.diretor,
            genero: req.body.genero,
            duracao: req.body.duracao},
            ['id', 'titulo', 'diretor', 'genero','duracao'])
        .then (filmes => {
            let filme = filmes[0]
            res.status(201).json ({ filme })
        })
        .catch (err => res.status(500).json ({ message: `Erro ao inserir filme ${err.message}`}))
})

//Atualiza filme

apiRouter.put('/filmes/:id', function (req, res) {
    let id = Number.parseInt(req.params.id);
    if (id > 0) {
        knex('filmes')
            .where('id', id)
            .update({
                titulo: req.body.titulo,
                diretor: req.body.diretor,
                genero: req.body.genero,
                duracao: req.body.duracao},
                ['id', 'titulo', 'diretor', 'genero','duracao'])
            .then (filmes => {
                let filme = filmes[0]
                res.status(200).json({filme})
            })
            .catch (err => res.status(500).json ({ message: `Erro ao atualizar filme ${err.message}`}))
    } else {
        res.status(404).json({
            message: "filme não encontrado"
        })
    }
})

//Deleta filme

apiRouter.delete('/filmes/:id', function (req, res) {
    let id = Number.parseInt(req.params.id);
    if (id > 0) {
        knex('filmes')
          .where('id', id)
          .del()
          .then(res.status(200).json({message: `filme ${id} excluído com sucesso`}))
          .catch (err => res.status(500).json ({ message: `Erro ao deletar filme ${err.message}`}))
    } else {
        res.status(404).json({
            message: "filme não encontrado"
        })
    }
})

module.exports = apiRouter;