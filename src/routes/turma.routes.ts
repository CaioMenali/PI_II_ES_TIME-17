// Autor: Felipe Batista Bastos

import { Router, Request, Response } from "express";
import { getConn } from "../database/oracle";
import oracledb from "oracledb";

const router = Router();

/* Cadastrar Turma */
router.post("/cadastro", async (req: Request, res: Response) => {
  const { nome, codigo, idDisciplina } = req.body;

  if (!idDisciplina)
    return res.status(400).json({ error: "idDisciplina é obrigatório." });

  try {
    const conn = await getConn();

    // Inserir turma
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

    const idTurma = (resultTurma.outBinds as any).id[0];

    // Criar vínculo com a disciplina 
    await conn.execute(
      `INSERT INTO DISCIPLINA_TURMA (ID_DISCIPLINA, ID_TURMA)
       VALUES (:disciplina, :turma)`,
      {
        disciplina: idDisciplina,
        turma: idTurma
      },
      { autoCommit: true }
    );

    await conn.close();

    res.json({ success: true, message: "Turma cadastrada!" });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* Listar turmas de uma disciplina específica */
router.get("/listar/:idDisciplina", async (req: Request, res: Response) => {
  const { idDisciplina } = req.params;

  try {
    const conn = await getConn();

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

    await conn.close();
    res.json(r.rows);

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
