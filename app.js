// Autor: Felipe Cesar Ferreira Lirani

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
  origin: ["http://localhost:3000", "http://localhost:3001"],
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type"]
}));

// Definimos uma porta onde o servidor HTTP de backend, irá funcionar
const port = 3000;

// Configuração da conexão com o banco de dados Oracle
const conexao = {
  user: "SYSTEM",
  password: "senha",
  connectString: "localhost:1521/XEPDB1"
};

// Acesso ao servidor
// Esta rota é responsável por responder à rota raiz ("/") do servidor.
app.get("/", (req, res) => {
  res.send("Servidor NotaDez rodando!"); 
});

// Rota para cadastro de um novo docente
// Esta rota é responsável por cadastrar um novo docente no banco de dados.
// Ela verifica se o e-mail já existe e, caso contrário, insere os dados do novo docente.
app.post("/cadastro", async (req, res) => {
  const { nome, email, telefone, senha } = req.body;

  try {
    // Inicia a conexão
    const conn = await oracledb.getConnection(conexao);

    // Verifica se o e-mail já existe
    const verifica = await conn.execute(
      "SELECT * FROM DOCENTE WHERE E_MAIL = :email",
      [email]
    );

    // Se a verificação encontrar email avisa que ja existe, se nao cria o usuario
    if (verifica.rows.length > 0) {
      res.send("E-mail já cadastrado!");
    } else {
      await conn.execute(
      `INSERT INTO DOCENTE (ID_DOCENTE, NOME, E_MAIL, TELEFONE_CELULAR, SENHA, FK_INSTITUICAO_ID_INSTITUICAO, FK_AUDITORIA_ID_AUDITORIA)
      VALUES (SEQ_DOCENTE.NEXTVAL, :nome, :email, :telefone, :senha, NULL, NULL)`,
      [nome, email, telefone, senha],
      { autoCommit: true }
      );

      res.send("Docente cadastrado com sucesso!");
    }

    // Encerra a conexão
    await conn.close();

  } catch (err) {
  console.error("Erro ao cadastrar docente:", err);
  res.status(500).send(`Erro Oracle: ${err.message}`);
 }
});


// Rota para login de docentes
// Esta rota é responsável por autenticar um docente.
// Ela verifica as credenciais (e-mail e senha) fornecidas e responde com sucesso ou falha no login.
app.post('/login', async (req, res) => {
  // Lê credenciais enviadas pelo cliente
  const { username, password } = req.body;
  // Abre conexão com Oracle usando configuração global
  const conn = await oracledb.getConnection(conexao);
  // Consulta por e-mail e senha
  const r = await conn.execute(
    'SELECT COUNT(*) AS COUNT FROM DOCENTE WHERE E_MAIL = :email AND SENHA = :senha',
    [username, password],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  const ok = r.rows && r.rows[0] && (r.rows[0].COUNT || r.rows[0]['COUNT']) > 0;
  // Fecha a conexão
  await conn.close();
  // Responde ao cliente de acordo com a validação
  if (ok) {
    res.json({ success: true, message: 'Login do Docente bem-sucedido!' });
  } else {
    res.json({ success: false, message: 'E-mail ou senha inválidos para docente.' });
  }
});

// Rota para listar todos os docentes
// Esta rota é responsável por listar todos os docentes cadastrados no banco de dados.
// Ela retorna uma lista com o ID, nome, e-mail e telefone celular de cada docente.
app.get("/docentes/listar", async (req, res) => {
  try {
    const conn = await oracledb.getConnection(conexao);

    const resultado = await conn.execute(
      `SELECT ID_DOCENTE, NOME, E_MAIL, TELEFONE_CELULAR
       FROM DOCENTE
       ORDER BY ID_DOCENTE`
    );

    await conn.close();
    res.json(resultado.rows);

  } catch (err) {
    console.error("Erro ao listar docentes:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Rota para cadastrar uma nova turma
// Esta rota é responsável por cadastrar uma nova turma no banco de dados.
// Ela recebe o nome e o código da turma e os insere na tabela de turmas.
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

  } catch (err) {
    console.error("Erro ao cadastrar turma:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

//Rota para listar todas as turmas cadastradas
// Esta rota é responsável por listar todas as turmas cadastradas no banco de dados.
// Ela retorna uma lista com o ID, nome e código de cada turma.
app.get("/turmas/listar", async (req, res) => {
  try {
    const conn = await oracledb.getConnection(conexao);
    const resultado = await conn.execute(
      `SELECT ID_TURMA, NOME, CODIGO FROM TURMA ORDER BY ID_TURMA`
    );
    await conn.close();

    res.json(resultado.rows);
  } catch (err) {
    console.error("Erro ao listar turmas:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

//Rota para cadastrar uma nova instituição
// Esta rota é responsável por cadastrar uma nova instituição e associá-la a um docente, se fornecido.
// Ela insere a instituição e, opcionalmente, atualiza o docente com o ID da nova instituição.
app.post("/instituicoes", async (req, res) => {
  console.log("Dados recebidos:", req.body);
  const { nome, docenteEmail } = req.body;

  try {
    const conn = await oracledb.getConnection(conexao);

    // Inserir a nova instituição e obter o ID gerado
    const resultInstituicao = await conn.execute(
      `INSERT INTO INSTITUICAO (ID_INSTITUICAO, NOME)
       VALUES (SEQ_INSTITUICAO.NEXTVAL, :nome)
       RETURNING ID_INSTITUICAO INTO :idInstituicao`,
      { nome: nome, idInstituicao: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } },
      { autoCommit: true }
    );

    const idInstituicao = resultInstituicao.outBinds.idInstituicao[0];

    // Associar a instituição ao docente
    if (docenteEmail && idInstituicao) {
      await conn.execute(
        `UPDATE DOCENTE SET FK_INSTITUICAO_ID_INSTITUICAO = :idInstituicao WHERE E_MAIL = :docenteEmail`,
        [idInstituicao, docenteEmail],
        { autoCommit: true }
      );
    }

    await conn.close();
    res.json({ success: true, message: "Instituição cadastrada com sucesso!" });

  } catch (err) {
    console.error("Erro ao cadastrar instituição:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

//Rota para listar todas as instituições cadastradas
// Esta rota é responsável por listar as instituições cadastradas.
// Ela pode filtrar as instituições por um docente específico, se o e-mail do docente for fornecido.
app.get("/instituicoes/listar", async (req, res) => {
  try {
    const conn = await oracledb.getConnection(conexao);
    const docenteEmail = req.query.docenteEmail;
    let instituicaoId = null;

    if (docenteEmail) {
      const docenteResult = await conn.execute(
        `SELECT FK_INSTITUICAO_ID_INSTITUICAO FROM DOCENTE WHERE E_MAIL = :email`,
        [docenteEmail]
      );

      if (docenteResult.rows.length > 0) {
        instituicaoId = docenteResult.rows[0][0];
      }
    }

    let query = `SELECT ID_INSTITUICAO, NOME FROM INSTITUICAO`;
    const binds = {};

    if (instituicaoId) {
      query += ` WHERE ID_INSTITUICAO = :instituicaoId`;
      binds.instituicaoId = instituicaoId;
    }

    query += ` ORDER BY ID_INSTITUICAO`;

    const resultado = await conn.execute(query, binds);

    console.log("INSTITUIÇÕES ENCONTRADAS:");
    console.log("Número total de instituições: " + resultado.rows.length);
    console.log(resultado.rows);

    await conn.close();
    res.json(resultado.rows);

  } catch (err) {
    console.error("Erro ao listar instituições:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Rota para cadastrar aluno
app.post("/alunos", async (req, res) => {
  const { nome, RA } = req.body;

  try {
    const conn = await oracledb.getConnection(conexao);

    await conn.execute(
      `INSERT INTO ALUNO (ID_ALUNO, MATRICULA, NOME, FK_NOTA_ID_NOTA, FK_AUDITORIA_ID_AUDITORIA)
       VALUES (SEQ_ALUNO.NEXTVAL, :ra, :nome, NULL, NULL)`,
      [RA, nome],
      { autoCommit: true }
    );

    await conn.close();
    res.json({ success: true, message: "Aluno cadastrado com sucesso!" });

  } catch (erro) {
    console.error("Erro ao cadastrar aluno:", erro);
    res.status(500).json({ success: false, message: erro.message });
  }
});

// Rota para cadastrar aluno
// Esta rota é responsável por cadastrar um novo aluno no banco de dados.
// Ela recebe o nome e o RA do aluno e os insere na tabela de alunos.
app.post("/alunos", async (req, res) => {
  const { nome, RA } = req.body;

  try {
    const conn = await oracledb.getConnection(conexao);

    await conn.execute(
      `INSERT INTO ALUNO (ID_ALUNO, MATRICULA, NOME, FK_NOTA_ID_NOTA, FK_AUDITORIA_ID_AUDITORIA)
       VALUES (SEQ_ALUNO.NEXTVAL, :ra, :nome, NULL, NULL)`,
      [RA, nome],
      { autoCommit: true }
    );

    await conn.close();
    res.json({ success: true, message: "Aluno cadastrado com sucesso!" });

  } catch (err) {
    console.error("Erro ao cadastrar aluno:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Rota para listar todos os alunos
// Esta rota é responsável por listar todos os alunos cadastrados no banco de dados.
// Ela retorna uma lista com o ID, matrícula e nome de cada aluno.
app.get("/alunos/listar", async (req, res) => {
  try {
    const conn = await oracledb.getConnection(conexao);

    const resultado = await conn.execute(
      `SELECT ID_ALUNO, MATRICULA, NOME 
       FROM ALUNO 
       ORDER BY ID_ALUNO`
    );

    await conn.close();

    res.json(resultado.rows);
  } catch (err) {
    console.error("Erro ao listar alunos:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Rota para cadastrar disciplina
// Esta rota é responsável por cadastrar uma nova disciplina no banco de dados.
// Ela recebe os dados da disciplina e os insere na tabela correspondente.
app.post("/disciplinas", async (req, res) => {
  const { nome, sigla, codigo, periodo } = req.body;

  try {
    const conn = await oracledb.getConnection(conexao);

    await conn.execute(
      `INSERT INTO DISCIPLINA (
        ID_DISCIPLINA, NOME, SIGLA, CODIGO, PERIODO, ID_INSTITUICAO, TIPOCALCULO, FK_TURMA_ID_TURMA, FK_COMPONENTE_ID_COMPONENTE
      ) VALUES (
        SEQ_DISCIPLINA.NEXTVAL, :nome, :sigla, :codigo, :periodo, NULL, NULL, NULL, NULL
      )`,
      [nome, sigla, codigo, periodo],
      { autoCommit: true }
    );

    await conn.close();
    res.json({ success: true, message: "Disciplina cadastrada com sucesso!" });

  } catch (err) {
    console.error("Erro ao cadastrar disciplina:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Rota para listar disciplinas
// Esta rota é responsável por listar todas as disciplinas cadastradas no banco de dados.
// Ela retorna uma lista com o ID, nome, sigla, código e período de cada disciplina.
app.get("/disciplinas/listar", async (req, res) => {
  try {
    const conn = await oracledb.getConnection(conexao);

    const resultado = await conn.execute(
      `SELECT ID_DISCIPLINA, NOME, SIGLA, CODIGO, PERIODO
       FROM DISCIPLINA
       ORDER BY ID_DISCIPLINA`
    );

    await conn.close();
    res.json(resultado.rows);

  } catch (err) {
    console.error("Erro ao listar disciplinas:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Rota para cadastrar um novo curso
// Esta rota é responsável por cadastrar um novo curso no banco de dados.
// Ela recebe o nome do curso e o ID da instituição a qual ele pertence.
app.post("/cursos", async (req, res) => {
  const { nome, fk_instituicao } = req.body;

  try {
    const conn = await oracledb.getConnection(conexao);

    await conn.execute(
      `INSERT INTO CURSO (ID_CURSO, NOME, FK_INSTITUICAO_ID_INSTITUICAO)
       VALUES (SEQ_CURSO.NEXTVAL, :nome, :inst)`,
      [nome, fk_instituicao],
      { autoCommit: true }
    );

    await conn.close();
    res.json({ success: true, message: "Curso cadastrado com sucesso!" });

  } catch (err) {
    console.error("Erro ao cadastrar curso:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Rota para listar todos os cursos cadastrados
// Esta rota é responsável por listar todos os cursos associados a uma instituição específica.
// Ela filtra os cursos pelo ID da instituição fornecido na URL.
app.get("/cursos/listar/:idInst", async (req, res) => {
  const id = req.params.idInst;

  try {
    const conn = await oracledb.getConnection(conexao);

    const r = await conn.execute(
      `SELECT ID_CURSO, NOME
       FROM CURSO
       WHERE FK_INSTITUICAO_ID_INSTITUICAO = :id
       ORDER BY ID_CURSO`,
      [id]
    );

    await conn.close();
    res.json(r.rows);

  } catch (err) {
    console.error("Erro ao listar cursos:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Rota para verificar se o e-mail existe no banco de dados
// Esta rota é responsável por verificar se um e-mail de docente existe no banco de dados.
// Ela é usada no processo de recuperação de senha para confirmar a existência do usuário.
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
// Esta rota é responsável por resetar a senha de um docente.
// Ela atualiza a senha de um docente no banco de dados com base no e-mail fornecido.
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

// Fim das rotas.

// Esta rota inicia o servidor de backend e o faz escutar em uma porta específica.
// Ela exibe uma mensagem no console indicando que o servidor está rodando e em qual porta.
app.listen(port, ()=>{
  console.log(`Servidor de backend rodando na porta: ${port}`);
});

//ao chegar a função listen, o servidor abrirá a porta definida
//para esperar as chamadas nas rotas que possui
//quando chegar uma chamada, ele irá verificar a rota