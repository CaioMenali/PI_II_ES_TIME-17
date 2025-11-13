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

//definimos uma constante que conecta com o banco de dados do oracle;

const oracledb = require("oracledb"); 

//definimos uma constante que possibilita a criação de caminhos.
//definimos uma constante que libera a pasta "pages", "scripts" e "styles" para o navegador acessar.
const path = require('path');
app.use('/pages', express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, "scripts")));
app.use(express.static(path.join(__dirname, "styles")));


// parse application/json
// o tipo que será usado no body
app.use(bodyParser.json());

// Permite que o servidor receba e entenda JSON no corpo das requisições
app.use(express.json());

//permite o cors, porem não filtra ninguém.
//todos podem acessar esse seviço.
//além disso, liga o cors com o backend.

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type"]
}));

//definimos uma porta onde o servidor HTTP de backend, irá funcionar
const port = 3000;


/***************************ROTAS****************************/

// Configuração da conexão com o banco de dados Oracle
const conexao = {
  user: "SYSTEM",
  password: "Fgrc2006*",
  connectString: "localhost:1521/XEPDB1"
};


/***************************ROTAS****************************/
//Acesso ao servidor

app.get("/", (req, res) => {
  res.send("Servidor rodando"); 
});

// ROTA 2: Cadastro de um novo docente (professor)

app.post("/cadastro", async (req, res) => {
  const { nome, email, telefone, senha } = req.body;

  try {
    const conn = await oracledb.getConnection(conexao);

    // Verifica se o e-mail já existe
    const verifica = await conn.execute(
      "SELECT * FROM DOCENTE WHERE E_MAIL = :email",
      [email]
    );

    if (verifica.rows.length > 0) {
      res.send("E-mail já cadastrado!");
    } else {
      // Verifica se a sequência existe (importante no Oracle)
      // Se não existir, crie com: CREATE SEQUENCE SEQ_DOCENTE START WITH 1 INCREMENT BY 1;
      await conn.execute(
        `INSERT INTO DOCENTE (ID_DOCENTE, NOME, E_MAIL, TELEFONE_CELULAR, SENHA, FK_INSTITUICAO_ID_INSTITUICAO, FK_AUDITORIA_ID_AUDITORIA)
         VALUES ("SYSTEM"."SEQ_DOCENTE".NEXTVAL, :nome, :email, :telefone, :senha, NULL, NULL)`,
         [nome, email, telefone, senha],
          { autoCommit: true }
);

      res.send("Docente cadastrado com sucesso!");
    }

    await conn.close();

  } catch (erro) {
  console.error("Erro ao cadastrar docente:", erro);
  res.status(500).send(`Erro Oracle: ${erro.message}`);
 }
});


// ROTA 3: Login de docentes

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const conn = await oracledb.getConnection(conexao);
    const resultado = await conn.execute(
      "SELECT ID_DOCENTE, NOME, E_MAIL, SENHA FROM DOCENTE WHERE E_MAIL = :email",
      [email]
    );

    if (resultado.rows.length === 0) {
      res.send("Docente não encontrado!");
    } else {
      const dados = resultado.rows[0];
      if (senha === dados[3]) {
        res.send("Login realizado com sucesso!");
      } else {
        res.send("Senha incorreta!");
      }
    }

    await conn.close();

  } catch (erro) {
    console.error("Erro no login:", erro);
    res.status(500).send("Erro no servidor ou no banco de dados!");
  }
});



// ROTA 4: Listar todos os docentes cadastrados

app.get("/docentes", async (req, res) => {
  try {
    const conn = await oracledb.getConnection(conexao);
    const resultado = await conn.execute(
      "SELECT ID_DOCENTE, NOME, E_MAIL, TELEFONE_CELULAR FROM DOCENTE ORDER BY ID_DOCENTE"
    );
    res.send(resultado.rows);
    await conn.close();
  } catch (erro) {
    console.error("Erro ao listar docentes:", erro);
    res.status(500).send("Erro no servidor ou no banco de dados!");
  }
});


// ROTA 5: Excluir um docente pelo ID

app.delete("/docentes/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const conn = await oracledb.getConnection(conexao);
    const resultado = await conn.execute(
      "DELETE FROM DOCENTE WHERE ID_DOCENTE = :id",
      [id],
      { autoCommit: true }
    );

    if (resultado.rowsAffected === 0) {
      res.send("Docente não encontrado!");
    } else {
      res.send("Docente removido com sucesso!");
    }

    await conn.close();

  } catch (erro) {
    console.error("Erro ao excluir docente:", erro);
    res.status(500).send("Erro no servidor ou no banco de dados!");
  }
});


// Rota para a tela Instituição.html
app.get('/instituicao', (req, res) => {
    // O método res.sendFile() envia o arquivo HTML especificado como resposta.
    // path.join() é usado para criar um caminho absoluto para o arquivo,
    // garantindo que funcione em qualquer sistema operacional.
    res.sendFile(path.join(__dirname, 'public', 'Instituicao.html'));
});

// Rota para a tela inicio.html
app.get('/inicio', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'inicial.html'));
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
});