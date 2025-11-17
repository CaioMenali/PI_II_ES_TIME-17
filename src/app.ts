// Autor: Felpe Cesar Ferreira Lirani

import express from "express";
import cors from "cors";
import path from "path";

// Importando as rotas
import docenteRoutes from "./routes/docente.routes";
import turmaRoutes from "./routes/turma.routes";
import instituicaoRoutes from "./routes/instituicao.routes";
import alunoRoutes from "./routes/aluno.routes";
import disciplinaRoutes from "./routes/disciplina.routes";
import cursoRoutes from "./routes/curso.routes";
import recoveryRoutes from "./routes/recovery.routes";

// Essa função faz a inicialização da aplicação Express.
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Arquivos estáticos
app.use("/pages", express.static(path.join(__dirname, "../pages")));
app.use("/scripts", express.static(path.join(__dirname, "../pages/scripts")));
app.use("/styles", express.static(path.join(__dirname, "../pages/styles")));

// Definição das rotas
app.use("/docentes", docenteRoutes);
app.use("/turmas", turmaRoutes);
app.use("/instituicoes", instituicaoRoutes);
app.use("/alunos", alunoRoutes);
app.use("/disciplinas", disciplinaRoutes);
app.use("/cursos", cursoRoutes);
app.use("/recover", recoveryRoutes);

// Isso exporta a instância do aplicativo Express para ser utilizada em outros módulos.
export default app;
