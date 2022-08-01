// Importa o módulo do Express Framework
const express = require('express')
const morgan = require('morgan')
const apiRouter = require('./routes/apiRouter');
const clientRouter = require('./routes/clientRouter');
const secRouter = require('./routes/secRouter');

// Inicializa um objeto de aplicação Express

const app = express()
const port = process.env.PORT || 3000;

app.use(express.json());

// //realiza log da requisição
app.use (morgan ('common'))
app.use('/api', apiRouter)

// Redireciona para um site estático
app.use('/site', clientRouter)

app.use('/seguranca', secRouter)

// Cria um manipulador da rota padrão

app.get('/', function (req, res) {

    res.send('Seja bem vindo à aplicação')

})

// Inicializa o servidor HTTP na porta 3000

app.listen(port, function () {

    console.log('Servidor rodando na porta 3000')

})