CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    senha_hash VARCHAR(255) NOT NULL
);

CREATE TABLE Instituicao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    id_usuario INT NOT NULL, 
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id)
);

CREATE TABLE Disciplina (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    sigla VARCHAR(20),
    codigo VARCHAR(20),
    periodo VARCHAR(50),
    tipo_calculo VARCHAR(20) NOT NULL, 
    id_instituicao INT NOT NULL,
    FOREIGN KEY (id_instituicao) REFERENCES Instituicao(id)
);

CREATE TABLE Turma (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    codigo VARCHAR(50),
    id_disciplina INT NOT NULL,
    FOREIGN KEY (id_disciplina) REFERENCES Disciplina(id)
);

CREATE TABLE Aluno (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(50) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL
);

CREATE TABLE TurmaAluno (
    id_turma INT NOT NULL,
    id_aluno INT NOT NULL,
    PRIMARY KEY (id_turma, id_aluno),
    FOREIGN KEY (id_turma) REFERENCES Turma(id),
    FOREIGN KEY (id_aluno) REFERENCES Aluno(id)
);

CREATE TABLE ComponenteNota (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    sigla_formula VARCHAR(20), 
    descricao TEXT,
    peso DECIMAL(4,2), 
    id_disciplina INT NOT NULL,
    FOREIGN KEY (id_disciplina) REFERENCES Disciplina(id)
);

CREATE TABLE Nota (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_aluno INT NOT NULL,
    id_componente_nota INT NOT NULL,
    valor DECIMAL(4,2) NOT NULL,
    FOREIGN KEY (id_aluno) REFERENCES Aluno(id),
    FOREIGN KEY (id_componente_nota) REFERENCES ComponenteNota(id)
);

CREATE TABLE AuditoriaNota (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL, 
    id_aluno INT NOT NULL, 
    id_componente_nota INT NOT NULL,
    data_hora DATETIME NOT NULL,
    descricao TEXT, 
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id),
    FOREIGN KEY (id_aluno) REFERENCES Aluno(id),
    FOREIGN KEY (id_componente_nota) REFERENCES ComponenteNota(id)
);