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
  password: "senha*",
  connectString: "localhost:1521/xe"
};


/***************************ROTAS****************************/
//Acesso ao servidor

app.get("/", (req, res) => {
  res.send("Servidor NotaDez rodando"); 
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
      VALUES (SEQ_DOCENTE.NEXTVAL, :nome, :email, :telefone, :senha, NULL, NULL)`,
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


// Rota para login de docentes

app.post('/login', async (req, res) => {
  // Lê credenciais enviadas pelo cliente
  const { username, password } = req.body;
  // Abre conexão com Oracle usando configuração global
  const conn = await oracledb.getConnection(conexao);
  // Consulta por combinação de e-mail e senha
  const r = await conn.execute(
    'SELECT COUNT(*) AS COUNT FROM DOCENTE WHERE E_MAIL = :email AND SENHA = :senha',
    [username, password],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );
  // Interpreta o resultado (COUNT > 0 indica credenciais válidas)
  const ok = r.rows && r.rows[0] && (r.rows[0].COUNT || r.rows[0]['COUNT']) > 0;
  // Fecha a conexão
  await conn.close();
  // Responde ao cliente conforme validação
  if (ok) {
    res.json({ success: true, message: 'Login do Docente bem-sucedido!' });
  } else {
    res.json({ success: false, message: 'E-mail ou senha inválidos para docente.' });
  }
});


// Rota para listar todos os docentes cadastrados

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

// Rota para cadastrar uma nova turma
app.post("/turmas", async (req, res) => {
  const { nome, codigo } = req.body;

  try {
    const conn = await oracledb.getConnection(conexao);

    // Inserir nova turma
    await conn.execute(
      `INSERT INTO TURMA (ID_TURMA, NOME, CODIGO, HORARIO, LOCAL)
       VALUES (SEQ_TURMA.NEXTVAL, :nome, :codigo, NULL, NULL)`,
      [nome, codigo],
      { autoCommit: true }
    );

    await conn.close();
    res.json({ success: true, message: "Turma cadastrada com sucesso!" });

  } catch (erro) {
    console.error("Erro ao cadastrar turma:", erro);
    res.status(500).json({ success: false, message: erro.message });
  }
});

//Rota para listar todas as turmas cadastradas
app.get("/turmas/listar", async (req, res) => {
  try {
    const conn = await oracledb.getConnection(conexao);
    const resultado = await conn.execute(
      `SELECT ID_TURMA, NOME, CODIGO FROM TURMA ORDER BY ID_TURMA`
    );
    await conn.close();

    res.json(resultado.rows);
  } catch (erro) {
    console.error("Erro ao listar turmas:", erro);
    res.status(500).json({ success: false, message: erro.message });
  }
});

// Rota para a tela turmas.html
app.get('/turmas', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'turmas.html'));
});

// Rota para a tela Instituição.html
app.get('/instituicao', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'Instituicao.html'));
});

// Rota para a tela inicio.html
app.get('/inicio', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Rota para a tela notas.html
app.get('/notas', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'notas.html'));
});

// Rota para a tela loginRecover.html
app.get('/recover', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'loginRecover.html'));
});


// Rota para verificar se o e-mail existe no banco de dados
app.post('/recover/verify-email', async (req, res) => {
  const { email } = req.body;
  const conn = await oracledb.getConnection(conexao);
  const r = await conn.execute(
    'SELECT COUNT(*) AS COUNT FROM DOCENTE WHERE E_MAIL = :email',
    [email],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );
  const exists = r.rows && r.rows[0] && (r.rows[0].COUNT || r.rows[0]['COUNT']) > 0;
  await conn.close();
  res.json({ exists });
});

// Rota para resetar a senha
app.post('/recover/reset', async (req, res) => {
  const { email, newPassword } = req.body;
  const conn = await oracledb.getConnection(conexao);
  const r = await conn.execute(
    'UPDATE DOCENTE SET SENHA = :senha WHERE E_MAIL = :email',
    [newPassword, email],
    { autoCommit: true }
  );
  await conn.close();
  res.json({ success: !!(r.rowsAffected && r.rowsAffected > 0) });
});


/*************************fim das rotas**********************/ 

app.listen(port, ()=>{
  console.log(`servidor de backend rodando na porta: ${port}`);
});

//ao chegar a função listen, o servidor abrirá a porta definida
//para esperar as chamadas nas rotas que possui
//quando chegar uma chamada, ele irá verificar a rota
//e executar a função associada a ela
//no caso, a rota /login, ele irá executar a função de login
//e a rota /docentes, ele irá executar a função de listar docentes