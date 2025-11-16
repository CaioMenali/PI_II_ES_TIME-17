import oracledb from "oracledb";

export const conexao = {
  user: "SYSTEM",
  password: "senha",
  connectString: "localhost:1521/XEPDB1"
};

export async function getConn() {
  return await oracledb.getConnection(conexao);
}
