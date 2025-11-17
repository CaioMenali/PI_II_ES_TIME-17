// Autor: Felpe Batista Bastos

import { Router, Request, Response } from "express";
import { getConn } from "../database/oracle";

const router = Router();

// Cadastrar turma
// Essa função faz o cadastro de uma nova turma no banco de dados.
router.post("/", async (req: Request, res: Response) => {
  const { nome, codigo } = req.body;

  try {
    const conn = await getConn();

    await conn.execute(
      `INSERT INTO TURMA (
        ID_TURMA, NOME, CODIGO, HORARIO, LOCAL
      )
      VALUES (SEQ_TURMA.NEXTVAL, :nome, :codigo, NULL, NULL)`,
      [nome, codigo],
      { autoCommit: true }
    );

    await conn.close();

    res.json({ success: true, message: "Turma cadastrada!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Listar turmas
// Essa função faz a listagem de todas as turmas cadastradas no banco de dados.
router.get("/listar", async (req: Request, res: Response) => {
  try {
    const conn = await getConn();
    const r = await conn.execute(
      `SELECT ID_TURMA, NOME, CODIGO FROM TURMA ORDER BY ID_TURMA`
    );
    await conn.close();
    res.json(r.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
