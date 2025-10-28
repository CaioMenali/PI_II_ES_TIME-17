// aqui teremos os codigos de todos os serviços rotas etc.
// nosso backend é na verdade um conjunto de pequenos programas.
// cada pequeno programa é uma função e, esta função é uma rota.

//definimos uma constante chamda express que faz referencia
// ao componente express
const express = require('express');
const bodyParser = require('body-parser');

//criamos um app de backend através do comando abaixo:
const app = express();
const cors = require('cors');


// parse application/json
// o tipo que será usado no body
app.use(bodyParser.json());

//permite o cors, porem não filtra ninguém.
//todos podem acessar esse seviço.
app.use(cors());

//definimos uma porta onde o servidor HTTP de backend, irá funcionar
const port = 3000;

//rotas
app.get('/',(req,res)=>{
    res.send('servidor ok');
});

/***************************ROTAS****************************/

// Rota para a tela Instituição.html
app.get('/instituicao', (req, res) => {
    // O método res.sendFile() envia o arquivo HTML especificado como resposta.
    // path.join() é usado para criar um caminho absoluto para o arquivo,
    // garantindo que funcione em qualquer sistema operacional.
    res.sendFile(path.join(__dirname, 'public', 'Instituicao.html'));
});

// Rota para a tela inicio.html
app.get('/inicio', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'inicio.html'));
});

// Rota para a tela turmas.html
app.get('/turmas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'turmas.html'));
});

// Rota para a tela notas.html
app.get('/notas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notas.html'));
});


/*************************fim das rotas**********************/ 


//ao chegar a função listen, o servidor abrirá a porta definida
//para esperar as chamadas nas rotas que possui
app.listen(port, ()=>{
    console.log(`servidor de backend rodando na porta: ${port}`);
})