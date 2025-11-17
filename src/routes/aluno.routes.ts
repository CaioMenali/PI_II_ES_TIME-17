// Autor: Felipe Batista Bastos

import { Router, Request, Response } from "express";
import { getConn } from "../database/oracle";
import oracledb from "oracledb";

const router = Router();

// Cadastrar aluno em uma turma
// Rota que cadastra um novo aluno em uma turma específica no banco de dados
router.post("/cadastro", async (req: Request, res: Response) => {
    // Extrai nome, matrícula e ID da turma do corpo da requisição
    const { nome, matricula, idTurma } = req.body;

    // Valida se todos os campos obrigatórios foram enviados
    if (!nome || !matricula || !idTurma)
        return res.status(400).json({ error: "Dados incompletos." });

    try {
        // Obtém conexão com o banco de dados
        const conn = await getConn();

        // Insere o aluno na tabela ALUNO e recupera o ID gerado pela sequence
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

        // Captura o ID do aluno recém-criado
        const idAluno = (rAluno.outBinds as any).idOut[0];

        // Associa o aluno à turma na tabela TURMA_ALUNO
        await conn.execute(
            `INSERT INTO TURMA_ALUNO (ID_TURMA, ID_ALUNO)
             VALUES (:turma, :aluno)`,
            { turma: idTurma, aluno: idAluno },
            { autoCommit: true }
        );

        // Fecha a conexão com o banco
        await conn.close();

        // Retorna resposta de sucesso
        res.json({ success: true, message: "Aluno cadastrado!" });

    } catch (err: any) {
        // Em caso de erro, retorna mensagem de erro com status 500
        res.status(500).json({ error: err.message });
    }
});

// Listar alunos de uma turma
// Rota que retorna a lista de alunos matriculados em uma turma específica
router.get("/listar/:idTurma", async (req: Request, res: Response) => {
    // Captura o ID da turma enviado na URL
    const { idTurma } = req.params;

    try {
        // Abre conexão com o banco
        const conn = await getConn();

        // Busca os alunos que pertencem à turma informada
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

        // Fecha a conexão
        await conn.close();

        // Retorna os alunos encontrados
        res.json(r.rows);

    } catch (err: any) {
        // Em caso de erro, devolve mensagem de erro com status 500
        res.status(500).json({ error: err.message });
    }
});

// Exporta o roteador para que possa ser importado e usado no servidor principal
export default router;
