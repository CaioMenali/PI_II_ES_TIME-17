// Autor: Felpe Cesar Ferreira Lirani

import { Router, Request, Response } from "express";
import oracledb from "oracledb";
import { getConn } from "../database/oracle";

const router = Router();

// Verificar email
// Essa rota faz a verificação da existência de um e-mail de docente no banco de dados.
router.post("/verify-email", async (req: Request, res: Response) => {
  // Extrai o e-mail enviado no corpo da requisição
  const { email } = req.body;

  // Obtém uma conexão com o banco de dados Oracle
  const conn = await getConn();
  // Executa uma consulta para verificar se o e-mail existe na tabela DOCENTE
  const r = await conn.execute(
    `SELECT COUNT(*) AS COUNT FROM DOCENTE WHERE E_MAIL = :email`,
    [email],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );

  // Verifica se o resultado possui linhas e se a contagem é maior que zero
  const exists = r.rows && (r.rows[0] as any).COUNT > 0;

  // Fecha a conexão com o banco de dados
  await conn.close();
  // Retorna um JSON indicando se o e-mail foi encontrado ou não
  res.json({ exists });
});

// Resetar senha
// Essa rota faz o reset da senha de um docente no banco de dados.
router.post("/reset", async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  // Obtém conexão com o banco de dados Oracle
  const conn = await getConn();

  // Atualiza a senha do docente cujo e-mail corresponde ao fornecido
  const r = await conn.execute(
    `UPDATE DOCENTE SET SENHA = :senha WHERE E_MAIL = :email`,
    [newPassword, email],
    { autoCommit: true } // Confirma a transação automaticamente
  );

  // Fecha a conexão com o banco de dados
  await conn.close();

  // Retorna sucesso true se pelo menos uma linha foi afetada, caso contrário false
  res.json({ success: r.rowsAffected && r.rowsAffected > 0 });
});

// Exporta o router para ser utilizado nas rotas da aplicação
export default router;
