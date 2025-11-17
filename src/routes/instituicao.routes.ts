// Autor: Felpe Cesar Ferreira Lirani

import { Router, Request, Response } from "express";
import oracledb from "oracledb";
import { getConn } from "../database/oracle";

const router = Router();

// Cadastrar instituição
// Rota que cadastra uma nova instituição e associa-a a um docente, se fornecido
router.post("/cadastro", async (req: Request, res: Response) => {
  // Extrai nome e e-mail do docente do corpo da requisição
  const { nome, docenteEmail } = req.body;

  try {
    // Obtém conexão com o banco de dados
    const conn = await getConn();

    // Insere nova instituição e captura o ID gerado pela sequence
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

    // Recupera o ID da instituição recém-criada
    const id = (resultInst.outBinds as { id: number[] }).id[0];

    // Se um e-mail de docente foi fornecido, vincula o docente à instituição
    if (docenteEmail) {
      // Busca o ID do docente pelo e-mail
      const resultDocente = await conn.execute(
        `SELECT ID_DOCENTE FROM DOCENTE WHERE E_MAIL = :docenteEmail`,
        [docenteEmail],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      // Se o docente existir, cria o vínculo na tabela DOCENTE_INSTITUICAO
      if (resultDocente.rows && resultDocente.rows.length > 0) {
        const docenteId = (resultDocente.rows[0] as any).ID_DOCENTE;

        await conn.execute(
          `INSERT INTO DOCENTE_INSTITUICAO (ID_DOCENTE, ID_INSTITUICAO)
           VALUES (:docenteId, :instituicaoId)`,
          [docenteId, id],
          { autoCommit: true }
        );
      }
    }

    // Fecha a conexão e retorna sucesso
    await conn.close();
    res.json({ success: true, message: "Instituição cadastrada!" });

  } catch (err: any) {
    // Em caso de erro, retorna status 500 com a mensagem de erro
    res.status(500).json({ error: err.message });
  }
});


// Listar instituições associadas a um docente
// Rota que retorna a lista de instituições vinculadas a um docente específico, se fornecido
router.get("/listar", async (req: Request, res: Response) => {
  // Extrai o e-mail do docente dos parâmetros da query
  const { docenteEmail } = req.query;

  // Valida se o e-mail foi fornecido
  if (!docenteEmail) {
    return res.status(400).json({ error: "docenteEmail é obrigatório." });
  }

  try {
    // Obtém conexão com o banco de dados
    const conn = await getConn();

    // Busca o ID do docente a partir do e-mail
    const resultDocente = await conn.execute(
      `SELECT ID_DOCENTE 
       FROM DOCENTE 
       WHERE E_MAIL = :docenteEmail`,
      [docenteEmail],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Se o docente não for encontrado, retorna erro 404
    if (!resultDocente.rows || resultDocente.rows.length === 0) {
      await conn.close();
      return res.status(404).json({ error: "Docente não encontrado." });
    }

    // Recupera o ID do docente encontrado
    const docenteId = (resultDocente.rows[0] as any).ID_DOCENTE;

    // Consulta as instituições vinculadas ao docente
    const r = await conn.execute(
      `SELECT 
          I.ID_INSTITUICAO AS "ID_INSTITUICAO",
          I.NOME AS "NOME"
       FROM INSTITUICAO I
       JOIN DOCENTE_INSTITUICAO DI ON I.ID_INSTITUICAO = DI.ID_INSTITUICAO
       WHERE DI.ID_DOCENTE = :id
       ORDER BY I.ID_INSTITUICAO`,
      [docenteId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Fecha a conexão com o banco
    await conn.close();

    // Retorna a lista de instituições ou array vazio se não houver
    return res.json(r.rows ?? []);

  } catch (err: any) {
    // Em caso de erro, retorna status 500 com a mensagem de erro
    res.status(500).json({ error: err.message });
  }
});

// Exporta o router para ser utilizado nas rotas da aplicação
export default router;