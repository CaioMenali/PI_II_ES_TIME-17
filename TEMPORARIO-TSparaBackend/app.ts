// verificarInstituicaoCurso.ts
import oracledb from "oracledb";

export async function verificarInstituicaoCurso(docenteId: number) {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: "usuario_banco",
            password: "senha_banco",
            connectString: "localhost:1521/xe"
        });

        const result = await connection.execute(
            `SELECT Instituicao, Curso FROM Docente WHERE ID = :id`,
            [docenteId],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (result.rows && result.rows.length > 0) {
            const { INSTITUICAO, CURSO } = result.rows[0];
            return {
              temInstituicao: !!INSTITUICAO,
              temCurso: !!CURSO
            };
        }
        return { temInstituicao: false, temCurso: false };
    } catch (error) {
        console.error("Erro ao acessar o banco Oracle:", error);
        throw error;
    } finally {
        if (connection) await connection.close();
    }
}
