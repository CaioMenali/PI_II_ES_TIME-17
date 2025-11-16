"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import das bibliotecas
const express_1 = __importDefault(require("express"));
// Importar arquivo com as credenciais do banco de dados
const data_source_1 = require("./data-source");
// Criação da aplicação express
const app = (0, express_1.default)();
// Inicializar conexão com banco de dados
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("Conexão com banco de dados realizada com sucesso");
})
    .catch((err) => {
    console.log("Erro ao inicializar Data Source:", err);
});
// Definindo a porta
const port = 3000;
// Iniciando o servidor na porta definifa
app.listen(port, () => {
    console.log(`Servidor de backend rodando na porta: ${port}`);
});
// Rota principal
app.get("/", (req, res) => {
    res.send("Servidor NotaDez rodando!");
});
