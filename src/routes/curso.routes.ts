// Autor: Felpe Batista Bastos

import { Router, Request, Response } from "express";
import oracledb from "oracledb";
import { getConn } from "../database/oracle";

const router = Router();

// Cadastrar curso
// Essa função faz o cadastro de um novo curso no banco de dados.
router.post("/cadastro", async (req: Request, res: Response) => {
  const { nome, fk_instituicao } = req.body;

  try {
    const conn = await getConn();

    await conn.execute(
      `INSERT INTO CURSO (
        ID_CURSO, NOME, FK_INSTITUICAO_ID_INSTITUICAO
      )
      VALUES (SEQ_CURSO.NEXTVAL, :nome, :inst)`,
      [nome, fk_instituicao],
      { autoCommit: true }
    );

    await conn.close();
    res.json({ success: true, message: "Curso cadastrado!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Listar cursos por ID da instituição
// Essa função faz a listagem de cursos por ID da instituição.
router.get("/listar/:idInst", async (req: Request, res: Response) => {
  const id = req.params.idInst;

  try {
    const conn = await getConn();

    const r = await conn.execute(
      `SELECT ID_CURSO, NOME
       FROM CURSO
       WHERE FK_INSTITUICAO_ID_INSTITUICAO = :id
       ORDER BY ID_CURSO`,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await conn.close();
    res.json(r.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
