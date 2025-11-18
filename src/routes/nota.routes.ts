// Autor: Felipe Batista Bastos

import { Router, Request, Response } from "express";
import { getConn } from "../database/oracle";
import oracledb from "oracledb";

const router = Router();

// Cadastrar nota do aluno */
router.post("/cadastro", async (req: Request, res: Response) => {
    // Extrai idAluno e valor do corpo da requisição
    const { idAluno, valor } = req.body;

    // Valida se a nota está dentro do intervalo permitido (0 a 10)
    if (valor < 0 || valor > 10)
        return res.status(400).json({ error: "A nota deve estar entre 0 e 10." });

    try {
        // Obtém uma conexão com o banco de dados Oracle
        const conn = await getConn();

        // Insere a nova nota na tabela NOTA usando a sequência SEQ_NOTA para gerar o ID
        await conn.execute(
            `INSERT INTO NOTA (ID_NOTA, VALOR, ID_ALUNO)
             VALUES (SEQ_NOTA.NEXTVAL, :valor, :aluno)`,
            { valor, aluno: idAluno },
            { autoCommit: true }
        );

        // Fecha a conexão com o banco
        await conn.close();

        // Retorna resposta de sucesso
        res.json({ success: true, message: "Nota cadastrada!" });

    } catch (err: any) {
        // Em caso de erro, retorna status 500 com a mensagem do erro
        res.status(500).json({ error: err.message });
    }
});

/* Atualizar nota existente */
router.put("/atualizar", async (req: Request, res: Response) => {
    // Extrai idNota e novoValor do corpo da requisição
    const { idNota, novoValor } = req.body;

    // Valida se o novo valor está dentro do intervalo permitido
    if (novoValor < 0 || novoValor > 10)
        return res.status(400).json({ error: "A nota deve estar entre 0 e 10." });

    try {
        // Obtém uma conexão com o banco de dados Oracle
        const conn = await getConn();

        // Executa a atualização da nota no banco
        await conn.execute(
            `UPDATE NOTA
             SET VALOR = :val
             WHERE ID_NOTA = :id`,
            { val: novoValor, id: idNota },
            { autoCommit: true }
        );

        // Fecha a conexão
        await conn.close();

        // Retorna resposta de sucesso
        res.json({ success: true, message: "Nota atualizada!" });

    } catch (err: any) {
        // Em caso de erro, retorna mensagem de erro com status 500
        res.status(500).json({ error: err.message });
    }
});
// Listar notas de uma turma
router.get("/listar/:idTurma", async (req: Request, res: Response) => {
    // Obtém o ID da turma enviado pela URL
    const { idTurma } = req.params;

    try {
        // Conecta ao banco de dados Oracle
        const conn = await getConn();

        // Busca as notas de todos os alunos da turma especificada
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

        // Fecha a conexão com o banco
        await conn.close();

        // Retorna as linhas da consulta como resposta JSON
        res.json(r.rows);

    } catch (err: any) {
        // Em caso de erro, retorna status 500 com a mensagem do erro
        res.status(500).json({ error: err.message });
    }
});

export default router;