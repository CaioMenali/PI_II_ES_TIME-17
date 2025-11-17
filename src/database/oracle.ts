import oracledb from "oracledb";

export const conexao = {
  user: "SYSTEM",
  password: "Fgrc2006*",
  connectString: "localhost:1521/xe"
};

export async function getConn() {
  return await oracledb.getConnection(conexao);
}
