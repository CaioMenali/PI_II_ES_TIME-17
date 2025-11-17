// Autor: Felpe Cesar Ferreira Lirani

import { Router, Request, Response } from "express";
import oracledb from "oracledb";
import { getConn } from "../database/oracle";

const router = Router();

// Cadastrar instituição
router.post("/cadastro", async (req: Request, res: Response) => {
  const { nome, docenteEmail } = req.body;

  try {
    const conn = await getConn();

    const resultInst = await conn.execute(
      `INSERT INTO INSTITUICAO (ID_INSTITUICAO, NOME)
       VALUES (SEQ_INSTITUICAO.NEXTVAL, :nome)
       RETURNING ID_INSTITUICAO INTO :id`,
      {
        nome,
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      },
      { autoCommit: true }
    );

    const id = (resultInst.outBinds as { id: number[] }).id[0];

    if (docenteEmail) {
      const resultDocente = await conn.execute(
        `SELECT ID_DOCENTE FROM DOCENTE WHERE E_MAIL = :docenteEmail`,
        [docenteEmail],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (resultDocente.rows && resultDocente.rows.length > 0) {
        const docenteId = (resultDocente.rows[0] as any).ID_DOCENTE;

        await conn.execute(
          `INSERT INTO DOCENTE_INSTITUICAO (ID_DOCENTE, ID_INSTITUICAO)
           VALUES (:docenteId, :instituicaoId)`,
          [docenteId, id],
          { autoCommit: true }
        );
      }
    }

    await conn.close();
    res.json({ success: true, message: "Instituição cadastrada!" });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// Listar instituições
router.get("/listar", async (req: Request, res: Response) => {
  const { docenteEmail } = req.query;

  if (!docenteEmail) {
    return res.status(400).json({ error: "docenteEmail é obrigatório." });
  }

  try {
    const conn = await getConn();

    const resultDocente = await conn.execute(
      `SELECT ID_DOCENTE 
       FROM DOCENTE 
       WHERE E_MAIL = :docenteEmail`,
      [docenteEmail],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!resultDocente.rows || resultDocente.rows.length === 0) {
      await conn.close();
      return res.status(404).json({ error: "Docente não encontrado." });
    }

    const docenteId = (resultDocente.rows[0] as any).ID_DOCENTE;

    const r = await conn.execute(
      `SELECT 
          I.ID_INSTITUICAO AS "ID_INSTITUICAO",
          I.NOME AS "NOME"
       FROM INSTITUICAO I
       JOIN DOCENTE_INSTITUICAO DI ON I.ID_INSTITUICAO = DI.ID_INSTITUICAO
       WHERE DI.ID_DOCENTE = :id
       ORDER BY I.ID_INSTITUICAO`,
      [docenteId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await conn.close();

    return res.json(r.rows ?? []);

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Excluir instituição
router.delete("/excluir:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const conn = await getConn();

    // Verificar se existem cursos associados a esta instituição
    const checkCourses = await conn.execute(
      `SELECT COUNT(*) AS "COUNT" FROM INSTITUICAO_CURSO WHERE ID_INSTITUICAO = :id`,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (checkCourses.rows && (checkCourses.rows[0] as any).COUNT > 0) {
      await conn.close();
      return res.status(409).json({ error: "Não é possível excluir a instituição, pois existem cursos vinculados a ela." });
    }

    // Excluir a instituição
    const result = await conn.execute(
      `DELETE FROM INSTITUICAO WHERE ID_INSTITUICAO = :id`,
      [id],
      { autoCommit: true }
    );

    await conn.close();

    if (result.rowsAffected && result.rowsAffected === 1) {
      res.status(200).json({ message: "Instituição excluída com sucesso." });
    } else {
      res.status(404).json({ error: "Instituição não encontrada." });
    }

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;