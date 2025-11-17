// Autor: Felpe Cesar Ferreira Lirani

import { Router, Request, Response } from "express";
import oracledb from "oracledb";
import { getConn } from "../database/oracle";

const router = Router();

// Cadastrar instituição
router.post("/cadastro", async (req: Request, res: Response) => {
  const { nome, docenteEmail } = req.body;

  try {
    // Abre conexão com o banco Oracle
    const conn = await getConn();

    // Insere a nova instituição e captura o ID gerado pela sequence
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

    // Extrai o ID da instituição recém-criada
    const id = (resultInst.outBinds as { id: number[] }).id[0];

    if (docenteEmail) {
      const resultDocente = await conn.execute(
        `SELECT ID_DOCENTE FROM DOCENTE WHERE E_MAIL = :docenteEmail`,
        [docenteEmail],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      // Se o docente existir, atualiza a coluna fk_Instuticao_ID_Instituicao na tabela Docente
      if (resultDocente.rows && resultDocente.rows.length > 0) {
        
        const docenteId = (resultDocente.rows[0] as any).ID_DOCENTE;

        await conn.execute(
          `INSERT INTO DOCENTE_INSTITUICAO (ID_DOCENTE, ID_INSTITUICAO)
           VALUES (:docenteId, :instituicaoId)`,
          [docenteId, id],
          { autoCommit: true }
        );
      } else {
        console.warn(`Docente com email ${docenteEmail} não encontrado para associação.`);
      }
    }

    // Fecha a conexão com o banco
    await conn.close();
    res.json({ success: true, message: "Instituição cadastrada!" });

  } catch (err: any) {
    // Em caso de erro, retorna status 500 com a mensagem do erro
    res.status(500).json({ error: err.message });
  }
});

// Listar instituições
router.get("/listar", async (req: Request, res: Response) => {
  const { docenteEmail } = req.query;

  // Validação: garante que o e-mail do docente foi informado
  if (!docenteEmail) {
    return res.status(400).json({ error: "docenteEmail é obrigatório." });
  }

  try {
    // Obtém uma conexão com o banco de dados Oracle
    // Busca todas as instituições cadastradas
    const conn = await getConn();

    const resultDocente = await conn.execute(
      `SELECT ID_DOCENTE FROM DOCENTE WHERE E_MAIL = :docenteEmail`,
      [docenteEmail],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!resultDocente.rows || resultDocente.rows.length === 0) {
      await conn.close();
      return res.status(404).json({ error: "Docente não encontrado." });
    }

    // Extrai o ID do docente encontrado
    const docenteId = (resultDocente.rows![0] as any).ID_DOCENTE;

    // Busca as instituições associadas ao docente através da tabela de associação DOCENTE_INSTITUICAO
    const r = await conn.execute(
      `SELECT I.ID_INSTITUICAO, I.NOME
       FROM INSTITUICAO I
       JOIN DOCENTE_INSTITUICAO DI ON I.ID_INSTITUICAO = DI.ID_INSTITUICAO
       WHERE DI.ID_DOCENTE = :docenteId
       ORDER BY I.ID_INSTITUICAO`,
      [docenteId]
    );

    await conn.close();
    res.json(r.rows ?? []);

  } catch (err: any) {
    // Em caso de erro na operação, retorna status 500 com a mensagem do erro
    res.status(500).json({ error: err.message });
  }
});

export default router;
