import { Router, Request, Response } from "express";
import oracledb from "oracledb";
import { getConn } from "../database/oracle";

const router = Router();

// -------------------------------------------------------
// Cadastrar curso
// -------------------------------------------------------
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

// Excluir curso
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  // TODO: Implementar verificação de permissões do usuário e autenticação
  // if (!req.user || !req.user.canDeleteCurso) {
  //   return res.status(403).json({ error: "Acesso negado." });
  // }

  try {
    const conn = await getConn();

    // Verificar se existem disciplinas associadas a este curso
    const checkDisciplinas = await conn.execute(
      `SELECT COUNT(*) AS "COUNT" FROM CURSO_DISCIPLINA WHERE ID_CURSO = :id`,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (checkDisciplinas.rows && (checkDisciplinas.rows[0] as any).COUNT > 0) {
      await conn.close();
      return res.status(409).json({ error: "Não é possível excluir o curso, pois existem disciplinas vinculadas a ele." });
    }

    // Excluir o curso da tabela INSTITUICAO_CURSO primeiro
    await conn.execute(
      `DELETE FROM INSTITUICAO_CURSO WHERE ID_CURSO = :id`,
      [id],
      { autoCommit: true }
    );

    // Excluir o curso da tabela CURSO
    const result = await conn.execute(
      `DELETE FROM CURSO WHERE ID_CURSO = :id`,
      [id],
      { autoCommit: true }
    );

    await conn.close();

    if (result.rowsAffected && result.rowsAffected === 1) {
      res.status(200).json({ message: "Curso excluído com sucesso." });
    } else {
      res.status(404).json({ error: "Curso não encontrado." });
    }

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
