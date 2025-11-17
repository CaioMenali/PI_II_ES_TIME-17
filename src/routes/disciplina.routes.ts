// Autor: Felpe Cesar Ferreira Lirani

import { Router, Request, Response } from "express";
import { getConn } from "../database/oracle";
import oracledb from "oracledb";

const router = Router();

// Cadastrar disciplina
// Rota que cadastra uma nova disciplina no banco de dados
router.post("/cadastro", async (req: Request, res: Response) => {
  // Extrai os dados enviados no corpo da requisição
  const { nome, sigla, codigo, periodo, idCurso } = req.body;

  // Valida se o idCurso foi fornecido
  if (!idCurso)
    return res.status(400).json({ error: "idCurso é obrigatório." });

  try {
    // Obtém uma conexão com o banco de dados Oracle
    const conn = await getConn();

    // Insere a nova disciplina na tabela DISCIPLINA e retorna o ID gerado
    const resultDisc = await conn.execute(
      `INSERT INTO DISCIPLINA (
         ID_DISCIPLINA, NOME, SIGLA, CODIGO, PERIODO, TIPOCALCULO
       ) VALUES (
         SEQ_DISCIPLINA.NEXTVAL, :nome, :sigla, :codigo, :periodo, NULL
       )
       RETURNING ID_DISCIPLINA INTO :id`,
      {
        nome,
        sigla,
        codigo,
        periodo,
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      }
    );

    // Recupera o ID da disciplina recém-criada
    const idDisciplina = (resultDisc.outBinds as any).id[0];

    // Associa a disciplina ao curso correspondente na tabela CURSO_DISCIPLINA
    await conn.execute(
      `INSERT INTO CURSO_DISCIPLINA (ID_CURSO, ID_DISCIPLINA)
       VALUES (:curso, :disc)`,
      [idCurso, idDisciplina],
      { autoCommit: true }
    );

    // Fecha a conexão com o banco
    await conn.close();

    // Retorna resposta de sucesso ao cliente
    res.json({ success: true, message: "Disciplina cadastrada!" });

  } catch (err: any) {
    // Em caso de erro, retorna mensagem de erro com status 500
    res.status(500).json({ error: err.message });
  }
});

// Listar disciplinas por curso
// Rota que lista todas as disciplinas vinculadas a um curso específico
router.get("/listar/:idCurso", async (req: Request, res: Response) => {
  // Captura o ID do curso enviado na URL
  const idCurso = req.params.idCurso;

  try {
    // Abre conexão com o banco Oracle
    const conn = await getConn();

    // Busca as disciplinas associadas ao curso via tabela CURSO_DISCIPLINA
    const r = await conn.execute(
      `SELECT 
          D.ID_DISCIPLINA,
          D.NOME,
          D.SIGLA,
          D.CODIGO,
          D.PERIODO
       FROM DISCIPLINA D
       JOIN CURSO_DISCIPLINA CD ON CD.ID_DISCIPLINA = D.ID_DISCIPLINA
       WHERE CD.ID_CURSO = :id
       ORDER BY D.ID_DISCIPLINA`,
      [idCurso],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Fecha a conexão e devolve os registros encontrados
    await conn.close();
    res.json(r.rows);

  } catch (err: any) {
    // Caso ocorra erro, retorna mensagem com status 500
    res.status(500).json({ error: err.message });
  }
});

// Exporta o router para ser utilizado nas rotas da aplicação
export default router;
