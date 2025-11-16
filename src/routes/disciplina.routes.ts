import { Router, Request, Response } from "express";
import { getConn } from "../database/oracle";

const router = Router();

// Cadastrar disciplina
router.post("/", async (req: Request, res: Response) => {
  const { nome, sigla, codigo, periodo } = req.body;

  try {
    const conn = await getConn();

    await conn.execute(
      `INSERT INTO DISCIPLINA (
        ID_DISCIPLINA, NOME, SIGLA, CODIGO, PERIODO,
        ID_INSTITUICAO, TIPOCALCULO, FK_TURMA_ID_TURMA, FK_COMPONENTE_ID_COMPONENTE
      ) VALUES (
        SEQ_DISCIPLINA.NEXTVAL, :nome, :sigla, :codigo, :periodo,
        NULL, NULL, NULL, NULL
      )`,
      [nome, sigla, codigo, periodo],
      { autoCommit: true }
    );

    await conn.close();
    res.json({ success: true, message: "Disciplina cadastrada!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Listar disciplinas
router.get("/listar", async (req: Request, res: Response) => {
  try {
    const conn = await getConn();

    const result = await conn.execute(
      `SELECT ID_DISCIPLINA, NOME, SIGLA, CODIGO, PERIODO
       FROM DISCIPLINA ORDER BY ID_DISCIPLINA`
    );

    await conn.close();
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
