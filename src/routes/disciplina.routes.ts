// Autor: Felpe Cesar Ferreira Lirani

import { Router, Request, Response } from "express";
import { getConn } from "../database/oracle";
import oracledb from "oracledb";

const router = Router();

// -------------------------------------------------------
// Cadastrar disciplina
// -------------------------------------------------------
router.post("/cadastro", async (req: Request, res: Response) => {
  const { nome, sigla, codigo, periodo, idCurso } = req.body;

  if (!idCurso)
    return res.status(400).json({ error: "idCurso é obrigatório." });

  try {
    const conn = await getConn();

    // 1) Inserir disciplina
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

    const idDisciplina = (resultDisc.outBinds as any).id[0];

    // 2) Fazer vínculo N:N com o curso
    await conn.execute(
      `INSERT INTO CURSO_DISCIPLINA (ID_CURSO, ID_DISCIPLINA)
       VALUES (:curso, :disc)`,
      [idCurso, idDisciplina],
      { autoCommit: true }
    );

    await conn.close();

    res.json({ success: true, message: "Disciplina cadastrada!" });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// -------------------------------------------------------
// Listar disciplinas por curso
// -------------------------------------------------------
router.get("/listar/:idCurso", async (req: Request, res: Response) => {
  const idCurso = req.params.idCurso;

  try {
    const conn = await getConn();

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

    await conn.close();
    res.json(r.rows);

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
