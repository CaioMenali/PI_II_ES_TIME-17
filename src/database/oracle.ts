// Autor: Felpe Cesar Ferreira Lirani

import oracledb from "oracledb";

export const conexao = {
  user: "SYSTEM",
  password: "Fgrc2006*",
  connectString: "localhost:1521/xe"
};

// Essa função faz a conexão com o banco de dados Oracle.
export async function getConn() {
  return await oracledb.getConnection(conexao);
}
