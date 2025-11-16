import express from "express";
import cors from "cors";
import path from "path";

// Import das rotas
import docenteRoutes from "./routes/docente.routes";
import turmaRoutes from "./routes/turma.routes";
import instituicaoRoutes from "./routes/instituicao.routes";
import alunoRoutes from "./routes/aluno.routes";
import disciplinaRoutes from "./routes/disciplina.routes";
import cursoRoutes from "./routes/curso.routes";
import recoveryRoutes from "./routes/recovery.routes";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Arquivos estáticos
app.use("/pages", express.static(path.join(__dirname, "pages")));
app.use(express.static(path.join(__dirname, "scripts")));
app.use(express.static(path.join(__dirname, "styles")));

// Rotas
app.use("/docentes", docenteRoutes);
app.use("/turmas", turmaRoutes);
app.use("/instituicoes", instituicaoRoutes);
app.use("/alunos", alunoRoutes);
app.use("/disciplinas", disciplinaRoutes);
app.use("/cursos", cursoRoutes);
app.use("/recover", recoveryRoutes);

export default app;
