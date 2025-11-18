/* Autor: Felipe Batista Bastos */

window.onload = async () => {
    const nome = localStorage.getItem("docenteName");
    const email = localStorage.getItem("docenteEmail");

    if (!nome || !email) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("docenteDisplay").textContent = nome;

    await carregarCursos();
};

/* 1. Carregar cursos */
async function carregarCursos() {
    const selectCurso = document.getElementById("select-curso");
    const docenteEmail = localStorage.getItem("docenteEmail");

    const rInst = await fetch(`http://localhost:3000/instituicoes/listar?docenteEmail=${encodeURIComponent(docenteEmail)}`);
    const instituicoes = await rInst.json();

    selectCurso.innerHTML = "";

    for (let inst of instituicoes) {
        const rCurso = await fetch(`http://localhost:3000/cursos/listar/${inst.ID_INSTITUICAO}`);
        const cursos = await rCurso.json();

        cursos.forEach(c => {
            let op = document.createElement("option");
            op.value = c.ID_CURSO;
            op.textContent = `${c.NOME} (${inst.NOME})`;
            selectCurso.appendChild(op);
        });
    }

    selectCurso.addEventListener("change", carregarDisciplinas);
    carregarDisciplinas();
}

/* 2. Carregar disciplinas */
async function carregarDisciplinas() {
    const idCurso = document.getElementById("select-curso").value;
    const selectDisc = document.getElementById("select-disciplina");

    const r = await fetch(`http://localhost:3000/disciplinas/listar/${idCurso}`);
    const disciplinas = await r.json();

    selectDisc.innerHTML = "";

    disciplinas.forEach(d => {
        let op = document.createElement("option");
        op.value = d.ID_DISCIPLINA;
        op.textContent = `${d.NOME} (${d.CODIGO})`;
        selectDisc.appendChild(op);
    });

    selectDisc.addEventListener("change", carregarTurmas);
    carregarTurmas();
}

/* 3. Carregar turmas */
async function carregarTurmas() {
    const idDisciplina = document.getElementById("select-disciplina").value;
    const selectTurma = document.getElementById("select-turma");

    const r = await fetch(`http://localhost:3000/turmas/listar/${idDisciplina}`);
    const turmas = await r.json();

    selectTurma.innerHTML = "";

    turmas.forEach(t => {
        let op = document.createElement("option");
        op.value = t.ID_TURMA;
        op.textContent = `${t.NOME} (${t.CODIGO})`;
        selectTurma.appendChild(op);
    });

    selectTurma.addEventListener("change", carregarAlunos);
    carregarAlunos();
}

/* 4. Carregar alunos */
async function carregarAlunos() {
    const idTurma = document.getElementById("select-turma").value;
    const selectAluno = document.getElementById("select-aluno");

    const r = await fetch(`http://localhost:3000/alunos/listar/${idTurma}`);
    const alunos = await r.json();

    selectAluno.innerHTML = "";

    alunos.forEach(a => {
        const op = document.createElement("option");
        op.value = a.ID_ALUNO;
        op.textContent = `${a.NOME} (RA: ${a.MATRICULA})`;
        selectAluno.appendChild(op);
    });
}

/* Salvar nota */
document.getElementById("form-cad-nota").addEventListener("submit", async (e) => {
    e.preventDefault();

    const idAluno = document.getElementById("select-aluno").value;
    const valor = parseFloat(document.getElementById("valor_nota").value);

    const resp = await fetch("http://localhost:3000/nota/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idAluno, valor })
    });

    const json = await resp.json();

    if (json.success) {
        alert("Nota cadastrada!");
        window.location.href = "nota.html";
    } else {
        alert("Erro: " + json.error);
    }
});