// Autor: Felpe Cesar Ferreira Lirani

import app from "./app";

// Definindo a porta
const port = 3000;

// Essa função faz a inicialização do servidor na porta especificada.
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

