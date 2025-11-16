import { Router, Request, Response } from "express";
import oracledb from "oracledb";
import { getConn } from "../database/oracle";

const router = Router();

// Cadastrar instituição
router.post("/", async (req: Request, res: Response) => {
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
router.get("/listar", async (req: Request, res: Response) => {
  try {
    const conn = await getConn();

    const r = await conn.execute(
      `SELECT ID_INSTITUICAO, NOME FROM INSTITUICAO ORDER BY ID_INSTITUICAO`
    );

    await conn.close();
    res.json(r.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
