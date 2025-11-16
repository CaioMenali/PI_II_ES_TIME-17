// Import das bibliotecas
import express, {Request, Response} from "express";

// Criação da aplicação express
const app = express();

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