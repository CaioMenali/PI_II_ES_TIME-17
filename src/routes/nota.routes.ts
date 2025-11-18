// Autor: Felipe Batista Bastos

import { Router, Request, Response } from "express";
import { getConn } from "../database/oracle";
import oracledb from "oracledb";

const router = Router();

/* 2. Cadastrar nota do aluno */
router.post("/cadastro", async (req: Request, res: Response) => {
    const { idAluno, valor } = req.body;

    if (valor < 0 || valor > 10)
        return res.status(400).json({ error: "A nota deve estar entre 0 e 10." });

    try {
        const conn = await getConn();

        await conn.execute(
            `INSERT INTO NOTA (ID_NOTA, VALOR, ID_ALUNO)
             VALUES (SEQ_NOTA.NEXTVAL, :valor, :aluno)`,
            { valor, aluno: idAluno },
            { autoCommit: true }
        );

        await conn.close();

        res.json({ success: true, message: "Nota cadastrada!" });

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

/* 3. Atualizar nota existente */
router.put("/atualizar", async (req: Request, res: Response) => {
    const { idNota, novoValor } = req.body;

    if (novoValor < 0 || novoValor > 10)
        return res.status(400).json({ error: "A nota deve estar entre 0 e 10." });

    try {
        const conn = await getConn();

        await conn.execute(
            `UPDATE NOTA
             SET VALOR = :val
             WHERE ID_NOTA = :id`,
            { val: novoValor, id: idNota },
            { autoCommit: true }
        );

        await conn.close();
        res.json({ success: true, message: "Nota atualizada!" });

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

/* 4. Listar notas de uma turma */
router.get("/listar/:idTurma", async (req: Request, res: Response) => {
    const { idTurma } = req.params;

    try {
        const conn = await getConn();

        const r = await conn.execute(
            `SELECT 
                N.ID_NOTA AS "ID_NOTA",
                N.VALOR AS "VALOR",
                A.ID_ALUNO AS "ID_ALUNO",
                A.MATRICULA AS "MATRICULA",
                A.NOME AS "ALUNO"
            FROM NOTA N
            JOIN ALUNO A ON A.ID_ALUNO = N.ID_ALUNO
            JOIN TURMA_ALUNO TA ON TA.ID_ALUNO = A.ID_ALUNO
            WHERE TA.ID_TURMA = :turma
            ORDER BY A.NOME`,
            [Number(idTurma)],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        await conn.close();
        res.json(r.rows);

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;