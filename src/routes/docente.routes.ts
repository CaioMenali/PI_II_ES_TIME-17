// Autor: Felpe Cesar Ferreira Lirani

import { Router, Request, Response } from "express";
import oracledb from "oracledb";
import { getConn } from "../database/oracle";

const router = Router();

// Cadastro de docente
// Essa função faz o cadastro de um novo docente no banco de dados.
router.post("/cadastro", async (req: Request, res: Response) => {
  // Extrai os dados do corpo da requisição
  const { nome, email, telefone, senha } = req.body;

  try {
    // Obtém uma conexão com o banco de dados Oracle
    const conn = await getConn();

    // Verifica se já existe um docente com o e-mail informado
    const verifica = await conn.execute(
      "SELECT * FROM DOCENTE WHERE E_MAIL = :email",
      [email]
    );

    // Se já existir, retorna mensagem de erro e encerra a função
    if (verifica.rows && verifica.rows.length > 0) {
      return res.send("E-mail já cadastrado!");
    }

    // Insere o novo docente na tabela DOCENTE
    // Usa a sequência SEQ_DOCENTE para gerar o ID automaticamente
    await conn.execute(
      `INSERT INTO DOCENTE (
        ID_DOCENTE, NOME, E_MAIL, TELEFONE_CELULAR, SENHA,
        FK_INSTITUICAO_ID_INSTITUICAO, FK_AUDITORIA_ID_AUDITORIA
      )
      VALUES (SEQ_DOCENTE.NEXTVAL, :nome, :email, :telefone, :senha, NULL, NULL)`,
      [nome, email, telefone, senha],
      { autoCommit: true }
    );

    // Fecha a conexão com o banco de dados
    await conn.close();
    
    // Retorna mensagem de sucesso ao cliente
    res.send("Docente cadastrado com sucesso!");

  } catch (err: any) {
    console.error("Erro:", err);
    res.status(500).send(err.message);
  }
});

// Login do docente
// Essa função faz a autenticação de docentes no sistema verificando suas credenciais.
router.post("/login", async (req: Request, res: Response) => {
  // Extrai o nome de usuário (e-mail) e senha do corpo da requisição
  const { username, password } = req.body;

  // Obtém uma conexão com o banco de dados Oracle
  const conn = await getConn();

  // Executa a consulta para verificar se existe um docente com o e-mail e senha informados
  const r = await conn.execute(
    `SELECT COUNT(*) AS COUNT 
     FROM DOCENTE 
     WHERE E_MAIL = :email AND SENHA = :senha`,
    [username, password],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  // Verifica se a quantidade de registros encontrados é maior que zero
  const ok = r.rows && (r.rows[0] as any).COUNT > 0;

  // Fecha a conexão com o banco de dados
  await conn.close();

  // Retorna a resposta JSON indicando sucesso ou falha no login
  res.json(
    ok
      ? { success: true, message: "Login realizado!" }
      : { success: false, message: "Credenciais inválidas." }
  );
});

// Listar docentes
// Essa função faz a listagem de todos os docentes cadastrados no banco de dados.
router.get("/listar", async (req: Request, res: Response) => {
  try {
    // Obtém uma conexão com o banco de dados Oracle
    const conn = await getConn();

    // Executa a consulta SQL para buscar os dados dos docentes
    // Seleciona apenas os campos necessários e ordena pelo ID_DOCENTE
    const r = await conn.execute(
      `SELECT ID_DOCENTE, NOME, E_MAIL, TELEFONE_CELULAR FROM DOCENTE ORDER BY ID_DOCENTE`
    );

    // Fecha a conexão com o banco de dados
    await conn.close();

    // Retorna os dados dos docentes em formato JSON
    res.json(r.rows);
  } catch (err: any) {
    // Em caso de erro, retorna uma resposta com status 500 e a mensagem de erro
    res.status(500).json({ error: err.message });
  }
});

export default router;
