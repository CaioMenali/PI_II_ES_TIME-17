
import { Router, Request, Response } from "express";
import oracledb from "oracledb";
import { getConn } from "../database/oracle";

const router = Router();

// Cadastro de docente
router.post("/cadastro", async (req: Request, res: Response) => {
  const { nome, email, telefone, senha } = req.body;

  try {
    const conn = await getConn();

    const verifica = await conn.execute(
      "SELECT * FROM DOCENTE WHERE E_MAIL = :email",
      [email]
    );

    if (verifica.rows && verifica.rows.length > 0) {
      return res.send("E-mail já cadastrado!");
    }

    await conn.execute(
      `INSERT INTO DOCENTE (
        ID_DOCENTE, NOME, E_MAIL, TELEFONE_CELULAR, SENHA,
        FK_INSTITUICAO_ID_INSTITUICAO, FK_AUDITORIA_ID_AUDITORIA
      )
      VALUES (SEQ_DOCENTE.NEXTVAL, :nome, :email, :telefone, :senha, NULL, NULL)`,
      [nome, email, telefone, senha],
      { autoCommit: true }
    );

    await conn.close();
    res.send("Docente cadastrado com sucesso!");

  } catch (err: any) {
    console.error("Erro:", err);
    res.status(500).send(err.message);
  }
});

// Login do docente
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const conn = await getConn();
  const r = await conn.execute(
    `SELECT COUNT(*) AS COUNT 
     FROM DOCENTE 
     WHERE E_MAIL = :email AND SENHA = :senha`,
    [username, password],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  const ok = r.rows && (r.rows[0] as any).COUNT > 0;
  await conn.close();

  res.json(
    ok
      ? { success: true, message: "Login realizado!" }
      : { success: false, message: "Credenciais inválidas." }
  );
});

// Listar docentes
router.get("/listar", async (req: Request, res: Response) => {
  try {
    const conn = await getConn();
    const r = await conn.execute(
      `SELECT ID_DOCENTE, NOME, E_MAIL, TELEFONE_CELULAR FROM DOCENTE ORDER BY ID_DOCENTE`
    );
    await conn.close();
    res.json(r.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
