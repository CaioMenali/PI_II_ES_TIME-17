import { Router, Request, Response } from "express";
import oracledb from "oracledb";
import { getConn } from "../database/oracle";

const router = Router();

router.post("/cadastro", async (req: Request, res: Response) => {
  const { nome, idInstituicao } = req.body;

  if (!idInstituicao)
    return res.status(400).json({ error: "idInstituicao é obrigatório." });

  try {
    const conn = await getConn();

    // 1) Inserir o curso
    const resultCurso = await conn.execute(
      `INSERT INTO CURSO (ID_CURSO, NOME)
       VALUES (SEQ_CURSO.NEXTVAL, :nome)
       RETURNING ID_CURSO INTO :id`,
      {
        nome,
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      }
    );

    const idCurso = (resultCurso.outBinds as any).id[0];

    // 2) Criar a relação N:N
    await conn.execute(
      `INSERT INTO INSTITUICAO_CURSO (ID_INSTITUICAO, ID_CURSO)
       VALUES (:idInstituicao, :idCurso)`,
      [idInstituicao, idCurso],
      { autoCommit: true }
    );

    await conn.close();

    res.json({ success: true, message: "Curso cadastrado!" });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/listar/:idInstituicao", async (req: Request, res: Response) => {
  const idInstituicao = req.params.idInstituicao;

  try {
    const conn = await getConn();

    const r = await conn.execute(
      `SELECT C.ID_CURSO, C.NOME
       FROM CURSO C
       JOIN INSTITUICAO_CURSO IC ON IC.ID_CURSO = C.ID_CURSO
       WHERE IC.ID_INSTITUICAO = :id
       ORDER BY C.ID_CURSO`,
      [idInstituicao],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await conn.close();
    res.json(r.rows);

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
