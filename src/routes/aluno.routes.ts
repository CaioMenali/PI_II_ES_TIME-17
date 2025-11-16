import { Router, Request, Response } from "express";
import { getConn } from "../database/oracle";

const router = Router();

// Cadastrar aluno
router.post("/", async (req: Request, res: Response) => {
  const { nome, RA } = req.body;

  try {
    const conn = await getConn();

    await conn.execute(
      `INSERT INTO ALUNO (
        ID_ALUNO, MATRICULA, NOME, FK_NOTA_ID_NOTA, FK_AUDITORIA_ID_AUDITORIA
      )
      VALUES (SEQ_ALUNO.NEXTVAL, :ra, :nome, NULL, NULL)`,
      [RA, nome],
      { autoCommit: true }
    );

    await conn.close();
    res.json({ success: true, message: "Aluno cadastrado!" });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Listar alunos
router.get("/listar", async (req: Request, res: Response) => {
  try {
    const conn = await getConn();
    const r = await conn.execute(
      `SELECT ID_ALUNO, MATRICULA, NOME FROM ALUNO ORDER BY ID_ALUNO`
    );
    await conn.close();
    res.json(r.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
