CREATE TABLE Instituicao (
    ID_Instituicao INT PRIMARY KEY,
    Nome VARCHAR2(255)
);

CREATE TABLE Curso (
    ID_Curso INT PRIMARY KEY,
    Nome VARCHAR2(255)
);

CREATE TABLE Instituicao_Curso (
    ID_Instituicao INT,
    ID_Curso INT,
    PRIMARY KEY (ID_Instituicao, ID_Curso),
    FOREIGN KEY (ID_Instituicao) REFERENCES Instituicao(ID_Instituicao),
    FOREIGN KEY (ID_Curso) REFERENCES Curso(ID_Curso)
);

CREATE TABLE Docente (
    ID_Docente INT PRIMARY KEY,
    Nome VARCHAR2(255),
    E_mail VARCHAR2(255),
    Telefone_celular VARCHAR2(20),
    Senha VARCHAR2(255),
    fk_Instuticao_ID_Instituicao INT,
    fk_Auditoria_ID_Auditoria INT
);

CREATE TABLE Docente_Instituicao (
    ID_Docente INT,
    ID_Instituicao INT,
    PRIMARY KEY (ID_Docente, ID_Instituicao),
    FOREIGN KEY (ID_Docente) REFERENCES Docente(ID_Docente),
    FOREIGN KEY (ID_Instituicao) REFERENCES Instituicao(ID_Instituicao)
);

CREATE TABLE Disciplina (
    ID_Disciplina INT PRIMARY KEY,
    Nome VARCHAR2(255),
    Sigla VARCHAR2(20),
    Codigo VARCHAR2(20),
    Periodo VARCHAR2(20),
    TipoCalculo VARCHAR2(50),
    fk_Turma_ID_Turma INT,
    fk_Componente_ID_Componente INT
);

CREATE TABLE Curso_Disciplina (
    ID_Curso INT NOT NULL,
    ID_Disciplina INT NOT NULL,
    PRIMARY KEY (ID_Curso, ID_Disciplina),
    FOREIGN KEY (ID_Curso) REFERENCES Curso(ID_Curso),
    FOREIGN KEY (ID_Disciplina) REFERENCES Disciplina(ID_Disciplina)
);
CREATE TABLE Turma (
    ID_Turma INT PRIMARY KEY,
    Nome VARCHAR2(255),
    Codigo VARCHAR2(20),
    Horario VARCHAR2(100),
    Local VARCHAR2(100)
);

CREATE TABLE Aluno (
    ID_Aluno INT PRIMARY KEY,
    Matricula VARCHAR2(30),
    Nome VARCHAR2(255),
    fk_Nota_ID_Nota INT,
    fk_Auditoria_ID_Auditoria INT
);

CREATE TABLE TurmaAluno_Inscreve (
    ID_Turma INT,
    ID_Aluno INT,
    Aluno_Matricula VARCHAR2(30),
    PRIMARY KEY (ID_Turma, ID_Aluno),
    fk_Turma_ID_Turma INT,
    fk_Aluno_ID_Aluno INT
);

CREATE TABLE Componente (
    ID_Componente INT PRIMARY KEY,
    Nome VARCHAR2(255),
    Sigla VARCHAR2(20),
    Descricao VARCHAR2(255),
    Peso NUMBER(5,2),
    ID_Disciplina INT,
    fk_Nota_ID_Nota INT,
    fk_Auditoria_ID_Auditoria INT
);

CREATE TABLE Nota (
    ID_Nota INT PRIMARY KEY,
    Valor NUMBER(5,2),
    ID_Aluno INT,
    ID_Componente INT
);

CREATE TABLE Auditoria (
    ID_Auditoria INT PRIMARY KEY,
    DataHora DATE,
    Mensagem VARCHAR2(255),
    ID_Docente INT,
    ID_Aluno INT,
    ID_Componente INT,
    fk_Auditoria_Docente INT,
    fk_Auditoria_Aluno INT,
    fk_Auditoria_Componente INT
);

CREATE SEQUENCE SEQ_DOCENTE
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;

CREATE SEQUENCE SEQ_TURMA
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;

CREATE SEQUENCE SEQ_INSTITUICAO
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;

CREATE SEQUENCE SEQ_ALUNO
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;

CREATE SEQUENCE SEQ_DISCIPLINA
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;

CREATE SEQUENCE SEQ_CURSO
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;


ALTER TABLE Docente ADD CONSTRAINT fk_Instuticao_ID_Instituicao FOREIGN KEY (fk_Instuticao_ID_Instituicao) REFERENCES Instituicao(ID_Instituicao);

ALTER TABLE Docente ADD CONSTRAINT fk_Auditoria_Docente FOREIGN KEY (fk_Auditoria_ID_Auditoria) REFERENCES Auditoria(ID_Auditoria);

ALTER TABLE Disciplina ADD CONSTRAINT fk_Turma_ID_Turma FOREIGN KEY (fk_Turma_ID_Turma) REFERENCES Turma(ID_Turma);

ALTER TABLE Disciplina ADD CONSTRAINT fk_Componente_ID_Componente FOREIGN KEY (fk_Componente_ID_Componente) REFERENCES Componente(ID_Componente);

ALTER TABLE TurmaAluno_Inscreve ADD CONSTRAINT fk_TurmaAluno_Turma FOREIGN KEY (fk_Turma_ID_Turma) REFERENCES Turma(ID_Turma);

ALTER TABLE TurmaAluno_Inscreve ADD CONSTRAINT fk_TurmaAluno_Aluno FOREIGN KEY (fk_Aluno_ID_Aluno) REFERENCES Aluno(ID_Aluno);

ALTER TABLE Componente ADD CONSTRAINT fk_Componente_Disciplina FOREIGN KEY (ID_Disciplina) REFERENCES Disciplina(ID_Disciplina);

ALTER TABLE Componente ADD CONSTRAINT fk_Nota_ID_Nota FOREIGN KEY (fk_Nota_ID_Nota) REFERENCES Nota(ID_Nota);

ALTER TABLE Componente ADD CONSTRAINT fk_Auditoria_Componente FOREIGN KEY (fk_Auditoria_ID_Auditoria) REFERENCES Auditoria(ID_Auditoria);

ALTER TABLE Nota ADD CONSTRAINT fk_Nota_Aluno FOREIGN KEY (ID_Aluno) REFERENCES Aluno(ID_Aluno);

ALTER TABLE Nota ADD CONSTRAINT fk_Nota_Componente FOREIGN KEY (ID_Componente) REFERENCES Componente(ID_Componente);

ALTER TABLE Aluno ADD CONSTRAINT fk_Aluno_Nota FOREIGN KEY (fk_Nota_ID_Nota) REFERENCES Nota(ID_Nota);

ALTER TABLE Aluno ADD CONSTRAINT fk_Auditoria_Aluno FOREIGN KEY (fk_Auditoria_ID_Auditoria) REFERENCES Auditoria(ID_Auditoria);
