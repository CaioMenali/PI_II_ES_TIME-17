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
    Senha VARCHAR2(255)
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
    TipoCalculo VARCHAR2(50)
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

CREATE TABLE Disciplina_Turma (
    ID_Disciplina INT NOT NULL,
    ID_Turma INT NOT NULL,
    PRIMARY KEY (ID_Disciplina, ID_Turma),
    FOREIGN KEY (ID_Disciplina) REFERENCES Disciplina(ID_Disciplina),
    FOREIGN KEY (ID_Turma) REFERENCES Turma(ID_Turma)
);

CREATE TABLE Aluno (
    ID_Aluno INT PRIMARY KEY,
    Matricula VARCHAR2(30),
    Nome VARCHAR2(255)
);

CREATE TABLE Turma_Aluno (
    ID_Turma INT NOT NULL,
    ID_Aluno INT NOT NULL,
    PRIMARY KEY (ID_Turma, ID_Aluno),
    FOREIGN KEY (ID_Turma) REFERENCES Turma(ID_Turma),
    FOREIGN KEY (ID_Aluno) REFERENCES Aluno(ID_Aluno)
);

CREATE TABLE Componente (
    ID_Componente INT PRIMARY KEY,
    Nome VARCHAR2(255),
    Sigla VARCHAR2(20),
    Descricao VARCHAR2(255),
    Peso NUMBER(5,2),
    ID_Disciplina INT
);

CREATE TABLE Nota (
    ID_Nota INT PRIMARY KEY,
    Valor NUMBER(5,2),
    ID_Aluno INT,
    ID_Componente INT
);

CREATE TABLE Aluno_Nota (
    ID_Aluno INT NOT NULL,
    ID_Disciplina INT NOT NULL,
    Nota_Final NUMBER(5,2),
    PRIMARY KEY (ID_Aluno, ID_Disciplina),
    FOREIGN KEY (ID_Aluno) REFERENCES Aluno(ID_Aluno),
    FOREIGN KEY (ID_Disciplina) REFERENCES Disciplina(ID_Disciplina)
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

CREATE SEQUENCE SEQ_NOTA
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;

CREATE SEQUENCE SEQ_COMPONENTE
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;

CREATE SEQUENCE AUDITORIA_SEQ 
START WITH 1 
INCREMENT BY 1;

CREATE OR REPLACE TRIGGER TG_AUDITORIA_NOTA
AFTER INSERT OR UPDATE ON NOTA
FOR EACH ROW
DECLARE
    v_msg VARCHAR2(255);
    v_nome_aluno ALUNO.NOME%TYPE;
BEGIN
    -- Buscar nome do aluno
    SELECT NOME INTO v_nome_aluno
    FROM ALUNO
    WHERE ID_ALUNO = :NEW.ID_ALUNO;

    IF INSERTING THEN
        v_msg := '(Aluno '  v_nome_aluno  ') - Nota ' 
                 TO_CHAR(:NEW.VALOR)  ' cadastrada pela primeira vez.';

    ELSIF UPDATING THEN
        v_msg := '(Aluno '  v_nome_aluno  ') - Nota de ' 
                 TO_CHAR(:OLD.VALOR)  ' para ' 
                 TO_CHAR(:NEW.VALOR)  ' modificada e salva.';
    END IF;

    INSERT INTO AUDITORIA (
        ID_AUDITORIA,
        DATAHORA,
        MENSAGEM,
        ID_DOCENTE,
        ID_ALUNO,
        ID_COMPONENTE,
        FK_AUDITORIA_DOCENTE,
        FK_AUDITORIA_ALUNO,
        FK_AUDITORIA_COMPONENTE
    )
    VALUES (
        AUDITORIA_SEQ.NEXTVAL, 
        SYSDATE,
        v_msg,
        NULL,
        :NEW.ID_ALUNO,
        NULL,
        NULL,
        NULL,
        NULL
    );
END;
/