// Import das bibliotecas
import express, {Request, Response} from "express";

// Importar arquivo com as credenciais do banco de dados
import { AppDataSource } from "./data-source";

// Criação da aplicação express
const app = express();

// Inicializar conexão com banco de dados
AppDataSource.initialize()
  .then(() => {
    console.log("Conexão com banco de dados realizada com sucesso");
  })
  .catch((err) => {
    console.log("Erro ao inicializar Data Source:", err);
  });

// Definindo a porta
const port = 3000;

// Iniciando o servidor na porta definifa
app.listen(port, ()=>{
  console.log(`Servidor de backend rodando na porta: ${port}`);
});

// Rota principal
app.get("/", (req: Request, res: Response) => {
  res.send("Servidor NotaDez rodando!"); 
});