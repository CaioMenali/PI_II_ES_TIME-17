

import OracleDB from "oracledb";

// caminho da wallet de conexao com o oracle
const walletPath = "";

// inicializar o cliente oracle, usando o wallet
OracleDB.initOracleClient({configDir: walletPath});

// formato de saida dos dados sera objetos JavaScript estruturados
OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
