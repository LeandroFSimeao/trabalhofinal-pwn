require('dotenv').config();
const express = require('express')
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

// const checkToken = (req, res, next) =>{
//     let authHeader = req.get('Authorization')
//     if(!authHeader){
//         res.status(403).json({message: 'Token requerida'});
//         res.end();
//     } else{
//         console.log(authHeader)
//         let token = authHeader.split(' ')[1]
//         req.role = token;
//         next();
//     }
// }

// const isAdmin = (req, res, next) => {
//     if (req.role && )
// }

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

apiRouter.get('/filmes/:id', function (req, res) {
    let id = Number.parseInt(req.params.id);
    
    if (id > 0) {
        knex
          .select("*")
          .from("filmes")
          .where('id', id)
          .then(filmes => res.json(filmes))
          .catch(err => {
            res.status(500).json({
                message: 'Erro ao recuperar filmes - ' + err.message
            })
        })
    } else {
        res.status(404).json({
            message: "filmes não encontrado"
        })
    }
})

//Cria novo filme

apiRouter.post('/filmes', express.json(), function (req, res){
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