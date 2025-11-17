// Autor: Felipe Batista Bastos

import { Router, Request, Response } from "express";
import { getConn } from "../database/oracle";
import oracledb from "oracledb";

const router = Router();

// Cadastrar Turma
// Rota que cria uma nova turma e a vincula a uma disciplina existente
router.post("/cadastro", async (req: Request, res: Response) => {
  // Extrai dados do corpo da requisição
  const { nome, codigo, idDisciplina } = req.body;

  // Valida se o ID da disciplina foi informado
  if (!idDisciplina)
    return res.status(400).json({ error: "idDisciplina é obrigatório." });

  try {
    // Conecta ao banco de dados
    const conn = await getConn();

    // Insere a nova turma na tabela TURMA e captura o ID gerado
    const resultTurma = await conn.execute(
      `INSERT INTO TURMA (
         ID_TURMA, NOME, CODIGO, HORARIO, LOCAL
       ) VALUES (
         SEQ_TURMA.NEXTVAL, :nome, :codigo, NULL, NULL
       )
       RETURNING ID_TURMA INTO :id`,
      {
        nome,
        codigo,
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      }
    );

    // Recupera o ID da turma recém-criada
    const idTurma = (resultTurma.outBinds as any).id[0];

    // Cria o vínculo entre a turma e a disciplina na tabela associativa
    await conn.execute(
      `INSERT INTO DISCIPLINA_TURMA (ID_DISCIPLINA, ID_TURMA)
       VALUES (:disciplina, :turma)`,
      {
        disciplina: idDisciplina,
        turma: idTurma
      },
      { autoCommit: true }
    );

    // Fecha a conexão com o banco
    await conn.close();

    // Retorna resposta de sucesso
    res.json({ success: true, message: "Turma cadastrada!" });

  } catch (err: any) {
    // Em caso de erro, retorna mensagem com status 500
    res.status(500).json({ error: err.message });
  }
});

// Listar turmas de uma disciplina específica
// Rota que lista todas as turmas associadas a uma disciplina específica
router.get("/listar/:idDisciplina", async (req: Request, res: Response) => {
  // Obtém o ID da disciplina vindo na URL
  const { idDisciplina } = req.params;

  try {
    // Conecta ao banco
    const conn = await getConn();

    // Busca todas as turmas ligadas à disciplina informada
    const r = await conn.execute(
      `SELECT 
          T.ID_TURMA,
          T.NOME,
          T.CODIGO,
          T.HORARIO,
          T.LOCAL
       FROM TURMA T
       JOIN DISCIPLINA_TURMA DT ON DT.ID_TURMA = T.ID_TURMA
       WHERE DT.ID_DISCIPLINA = :id
       ORDER BY T.ID_TURMA`,
      [idDisciplina],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Fecha conexão e devolve lista de turmas
    await conn.close();
    res.json(r.rows);

  } catch (err: any) {
    // Em caso de erro, retorna mensagem de erro 500
    res.status(500).json({ error: err.message });
  }
});

// Exporta o router para ser utilizado nas rotas da aplicação
export default router;
