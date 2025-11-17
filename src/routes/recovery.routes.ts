// Autor: Felpe Cesar Ferreira Lirani

import { Router, Request, Response } from "express";
import oracledb from "oracledb";
import { getConn } from "../database/oracle";

const router = Router();

// Verificar email
// Essa função faz a verificação da existência de um e-mail de docente no banco de dados.
router.post("/verify-email", async (req: Request, res: Response) => {
  const { email } = req.body;

  const conn = await getConn();
  const r = await conn.execute(
    `SELECT COUNT(*) AS COUNT FROM DOCENTE WHERE E_MAIL = :email`,
    [email],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  const exists = r.rows && (r.rows[0] as any).COUNT > 0;

  await conn.close();
  res.json({ exists });
});

// Resetar senha
// Essa função faz o reset da senha de um docente no banco de dados.
router.post("/reset", async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  const conn = await getConn();
  const r = await conn.execute(
    `UPDATE DOCENTE SET SENHA = :senha WHERE E_MAIL = :email`,
    [newPassword, email],
    { autoCommit: true }
  );

  await conn.close();

  res.json({ success: r.rowsAffected && r.rowsAffected > 0 });
});

export default router;
