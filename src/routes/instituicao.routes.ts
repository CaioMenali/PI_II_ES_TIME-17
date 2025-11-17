// Autor: Felpe Cesar Ferreira Lirani

import { Router, Request, Response } from "express";
import oracledb from "oracledb";
import { getConn } from "../database/oracle";

const router = Router();

// Cadastrar instituição
// Essa função faz o cadastro de uma nova instituição no banco de dados.
// Recebe no corpo da requisição:
// - nome (obrigatório): nome da instituição a ser criada
// - docenteEmail (opcional): e-mail de um docente existente que será vinculado à nova instituição
// Se o docente for informado, a função também cria o relacionamento na tabela DOCENTE_INSTITUICAO
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

    // Associar o docente à instituição através da tabela de junção Docente_Instituicao
    if (docenteEmail) {
      // Busca o ID do docente a partir do e-mail fornecido
      const resultDocente = await conn.execute<{ ID_DOCENTE: number }>(
        `SELECT ID_DOCENTE FROM DOCENTE WHERE E_MAIL = :docenteEmail`,
        [docenteEmail]
      );

      // Se o docente existir, cria o relacionamento na tabela de junção
      if (resultDocente.rows && resultDocente.rows.length > 0) {
        const docenteId = resultDocente.rows[0].ID_DOCENTE;
        await conn.execute(
          `INSERT INTO DOCENTE_INSTITUICAO (ID_DOCENTE, ID_INSTITUICAO)
           VALUES (:docenteId, :instituicaoId)`,
          [docenteId, id],
          { autoCommit: true }
        );
      } else {
        // Opcional: Tratar caso o docente não seja encontrado
        console.warn(`Docente com email ${docenteEmail} não encontrado para associação.`);
      }
    }

    // Fecha a conexão com o banco
    await conn.close();

    // Retorna resposta de sucesso
    res.json({ success: true, message: "Instituição cadastrada!" });
  } catch (err: any) {
    // Em caso de erro, retorna status 500 com a mensagem do erro
    res.status(500).json({ error: err.message });
  }
});

// Listar instituições
// Essa função faz a listagem de todas as instituições cadastradas no banco de dados.
// Recebe como parâmetro de query o e-mail do docente e retorna apenas as instituições
// associadas a esse docente por meio da tabela de relacionamento DOCENTE_INSTITUICAO.
router.get("/listar", async (req: Request, res: Response) => {
  const { docenteEmail } = req.query;

  // Validação: garante que o e-mail do docente foi informado
  if (!docenteEmail) {
    return res.status(400).json({ error: "docenteEmail é obrigatório." });
  }

  try {
    // Obtém uma conexão com o banco de dados Oracle
    const conn = await getConn();

    // Busca o ID do docente a partir do e-mail fornecido
    const resultDocente = await conn.execute<{ ID_DOCENTE: number }>(
      `SELECT ID_DOCENTE FROM DOCENTE WHERE E_MAIL = :docenteEmail`,
      [docenteEmail]
    );

    // Caso o docente não exista, retorna erro 404
    if (resultDocente.rows && resultDocente.rows.length === 0) {
      await conn.close();
      return res.status(404).json({ error: "Docente não encontrado." });
    }

    // Extrai o ID do docente encontrado
    const docenteId = resultDocente.rows![0].ID_DOCENTE;

    // Busca as instituições associadas ao docente através da tabela de junção DOCENTE_INSTITUICAO
    const r = await conn.execute(
      `SELECT I.ID_INSTITUICAO, I.NOME
       FROM INSTITUICAO I
       JOIN DOCENTE_INSTITUICAO DI ON I.ID_INSTITUICAO = DI.ID_INSTITUICAO
       WHERE DI.ID_DOCENTE = :docenteId
       ORDER BY I.ID_INSTITUICAO`,
      [docenteId]
    );

    // Caso o docente não esteja associado a nenhuma instituição, retorna erro 404
    if (r.rows && r.rows.length === 0) {
      await conn.close();
      return res.status(404).json({ error: "Nenhuma instituição encontrada para este docente." });
    }

    // Fecha a conexão com o banco e retorna as instituições encontradas
    await conn.close();
    res.json(r.rows);
  } catch (err: any) {
    // Em caso de erro na operação, retorna status 500 com a mensagem do erro
    res.status(500).json({ error: err.message });
  }
});

export default router;
