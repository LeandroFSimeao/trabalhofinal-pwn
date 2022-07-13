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

//Lista produtos

apiRouter.get('/produtos', function (req, res) {

    knex
        .select("*")
        .from("produto")
        .then(produtos => res.status(200).json(produtos))
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao recuperar produtos - ' + err.message
            })
        })
})

//Lista produto por id

apiRouter.get('/produtos/:id', function (req, res) {
    let id = Number.parseInt(req.params.id);
    
    if (id > 0) {
        knex
          .select("*")
          .from("produto")
          .where('id', id)
          .then(produtos => res.json(produtos))
          .catch(err => {
            res.status(500).json({
                message: 'Erro ao recuperar produtos - ' + err.message
            })
        })
    } else {
        res.status(404).json({
            message: "Produto não encontrado"
        })
    }
})

//Cria novo produto

apiRouter.post('/produtos', express.json(), function (req, res){
    knex('produto')
        .insert({
            descricao: req.body.descricao,
            valor: req.body.valor,
            marca: req.body.marca},
            ['id', 'descricao', 'valor', 'marca'])
        .then (produtos => {
            let produto = produtos[0]
            res.status(201).json ({ produto })
        })
        .catch (err => res.status(500).json ({ message: `Erro ao inserir produto ${err.message}`}))
})

//Atualiza produto

apiRouter.put('/produtos/:id', function (req, res) {
    let id = Number.parseInt(req.params.id);
    if (id > 0) {
        knex('produto')
            .where('id', id)
            .update({
                descricao: req.body.descricao,
                valor: req.body.valor,
                marca: req.body.marca
            },
            ['id','descricao','valor','marca'])
            .then (produtos => {
                let produto = produtos[0]
                res.status(200).json({produto})
            })
            .catch (err => res.status(500).json ({ message: `Erro ao atualizar produto ${err.message}`}))
    } else {
        res.status(404).json({
            message: "Produto não encontrado"
        })
    }
})

//Deleta produto

apiRouter.delete('/produtos/:id', function (req, res) {
    let id = Number.parseInt(req.params.id);
    if (id > 0) {
        knex('produto')
          .where('id', id)
          .del()
          .then(res.status(200).json({message: `Produto ${id} excluído com sucesso`}))
          .catch (err => res.status(500).json ({ message: `Erro ao deletar produto ${err.message}`}))
    } else {
        res.status(404).json({
            message: "Produto não encontrado"
        })
    }
})

module.exports = apiRouter;