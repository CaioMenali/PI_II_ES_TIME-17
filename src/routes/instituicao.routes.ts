// Autor: Felpe Cesar Ferreira Lirani

import { Router, Request, Response } from "express";
import oracledb from "oracledb";
import { getConn } from "../database/oracle";

const router = Router();

// Cadastrar instituição
// Essa função faz o cadastro de uma nova instituição no banco de dados.
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
      await conn.execute(
        `UPDATE DOCENTE
         SET FK_INSTITUICAO_ID_INSTITUICAO = :id
         WHERE E_MAIL = :email`,
        [id, docenteEmail],
        { autoCommit: true }
      );
    }

    await conn.close();

    res.json({ success: true, message: "Instituição cadastrada!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Listar instituições
// Essa função faz a listagem de todas as instituições cadastradas no banco de dados.
router.get("/listar", async (req: Request, res: Response) => {
  const { docenteEmail } = req.query;

  if (!docenteEmail) {
    return res.status(400).json({ error: "docenteEmail é obrigatório." });
  }
  try {
    const conn = await getConn();

    const resultDocente = await conn.execute<{ ID_DOCENTE: number }>(
      `SELECT ID_DOCENTE FROM DOCENTE WHERE E_MAIL = :docenteEmail`,
      [docenteEmail]
    );

    if (resultDocente.rows && resultDocente.rows.length === 0) {
      await conn.close();
      return res.status(404).json({ error: "Docente não encontrado." });
    }

    const docenteId = resultDocente.rows![0].ID_DOCENTE;

    const r = await conn.execute(
      `SELECT ID_INSTITUICAO, NOME FROM INSTITUICAO WHERE FK_DOCENTE_ID_DOCENTE = :docenteId ORDER BY ID_INSTITUICAO`,
      [docenteId]
    );

    if (r.rows && r.rows.length === 0) {
      await conn.close();
      return res.status(404).json({ error: "Nenhuma instituição encontrada para este docente." });
    }

    await conn.close();
    res.json(r.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
