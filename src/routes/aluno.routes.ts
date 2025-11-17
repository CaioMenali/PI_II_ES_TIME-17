// Autor: Felipe Batista Bastos

import { Router, Request, Response } from "express";
import { getConn } from "../database/oracle";
import oracledb from "oracledb";

const router = Router();

/* Cadastrar aluno em uma turma */
router.post("/cadastro", async (req: Request, res: Response) => {
    const { nome, matricula, idTurma } = req.body;

    if (!nome || !matricula || !idTurma)
        return res.status(400).json({ error: "Dados incompletos." });

    try {
        const conn = await getConn();

        // 1. Cadastrar aluno
        const rAluno = await conn.execute(
            `INSERT INTO ALUNO (ID_ALUNO, MATRICULA, NOME)
             VALUES (SEQ_ALUNO.NEXTVAL, :mat, :nome)
             RETURNING ID_ALUNO INTO :idOut`,
            {
                mat: matricula,
                nome,
                idOut: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            }
        );

        const idAluno = (rAluno.outBinds as any).idOut[0];

        // 2. Vincular aluno à turma
        await conn.execute(
            `INSERT INTO TURMA_ALUNO (ID_TURMA, ID_ALUNO)
             VALUES (:turma, :aluno)`,
            { turma: idTurma, aluno: idAluno },
            { autoCommit: true }
        );

        await conn.close();

        res.json({ success: true, message: "Aluno cadastrado!" });

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

/* Listar alunos de uma turma */
router.get("/listar/:idTurma", async (req: Request, res: Response) => {
    const { idTurma } = req.params;

    try {
        const conn = await getConn();

        const r = await conn.execute(
            `SELECT 
                A.ID_ALUNO AS "ID_ALUNO",
                A.MATRICULA AS "MATRICULA",
                A.NOME AS "NOME"
             FROM ALUNO A
             JOIN TURMA_ALUNO TA ON TA.ID_ALUNO = A.ID_ALUNO
             WHERE TA.ID_TURMA = :id
             ORDER BY A.NOME`,
            [ Number(idTurma) ], 
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        await conn.close();
        res.json(r.rows);

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
