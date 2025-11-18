import { Router, Request, Response } from "express";
import oracledb from "oracledb";
import { getConn } from "../database/oracle";

const router = Router();

// Cadastro de um novo curso
// Rota que cadastra um novo curso e o vincula a uma instituição
router.post("/cadastro", async (req: Request, res: Response) => {
  // Extrai nome e id da instituição do corpo da requisição
  const { nome, idInstituicao } = req.body;

  // Valida se o id da instituição foi fornecido
  if (!idInstituicao)
    return res.status(400).json({ error: "idInstituicao é obrigatório." });

  try {
    // Obtém conexão com o banco Oracle
    const conn = await getConn();

    // Insere o novo curso e captura o ID gerado pela sequence
    const resultCurso = await conn.execute(
      `INSERT INTO CURSO (ID_CURSO, NOME)
       VALUES (SEQ_CURSO.NEXTVAL, :nome)
       RETURNING ID_CURSO INTO :id`,
      {
        nome,
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      }
    );

    // Recupera o ID do curso recém-criado
    const idCurso = (resultCurso.outBinds as any).id[0];

    // Associa o curso à instituição na tabela de relacionamento
    await conn.execute(
      `INSERT INTO INSTITUICAO_CURSO (ID_INSTITUICAO, ID_CURSO)
       VALUES (:idInstituicao, :idCurso)`,
      [idInstituicao, idCurso],
      { autoCommit: true }
    );

    // Fecha a conexão com o banco
    await conn.close();

    // Retorna resposta de sucesso
    res.json({ success: true, message: "Curso cadastrado!" });

  } catch (err: any) {
    // Em caso de erro, retorna mensagem de erro com status 500
    res.status(500).json({ error: err.message });
  }
});

// Listar cursos de uma instituição
// Lista todos os cursos vinculados a uma instituição específica
router.get("/listar/:idInstituicao", async (req: Request, res: Response) => {
  // Captura o id da instituição vindo na URL
  const idInstituicao = req.params.idInstituicao;

  try {
    // Conecta ao banco Oracle
    const conn = await getConn();

    // Busca os cursos relacionados à instituição informada
    const r = await conn.execute(
      `SELECT C.ID_CURSO, C.NOME
       FROM CURSO C
       JOIN INSTITUICAO_CURSO IC ON IC.ID_CURSO = C.ID_CURSO
       WHERE IC.ID_INSTITUICAO = :id
       ORDER BY C.ID_CURSO`,
      [idInstituicao],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Fecha a conexão com o banco
    await conn.close();

    // Retorna os dados encontrados
    res.json(r.rows);

  } catch (err: any) {
    // Em caso de erro, retorna status 500 com a mensagem do erro
    res.status(500).json({ error: err.message });
  }
});

// Exporta o router para ser utilizado nas rotas da aplicação
export default router;
