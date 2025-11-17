/* Autor: Gabriel Batista Bastos*/

// Este arquivo contém as funções JavaScript para a listagem de alunos.
// Ele é responsável por carregar e exibir a lista de alunos cadastrados na interface do usuário.

// Quando carregar a página, listar alunos
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

// 1. Carrega cursos
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
            const op = document.createElement("option");
            op.value = c.ID_CURSO;
            op.textContent = `${c.NOME} (${inst.NOME})`;
            selectCurso.appendChild(op);
        });
    }

    selectCurso.addEventListener("change", carregarDisciplinas);
    carregarDisciplinas();
}

// 2. Carregar disciplinas
async function carregarDisciplinas() {
    const idCurso = document.getElementById("select-curso").value;
    const selectDisc = document.getElementById("select-disciplina");

    const r = await fetch(`http://localhost:3000/disciplinas/listar/${idCurso}`);
    const disciplinas = await r.json();

    selectDisc.innerHTML = "";

    disciplinas.forEach(d => {
        const op = document.createElement("option");
        op.value = d.ID_DISCIPLINA;
        op.textContent = `${d.NOME} (${d.CODIGO})`;
        selectDisc.appendChild(op);
    });

    selectDisc.addEventListener("change", carregarTurmas);
    carregarTurmas();
}

// 3. Carregar turmas
async function carregarTurmas() {
    const idDisciplina = document.getElementById("select-disciplina").value;
    const selectTurma = document.getElementById("select-turma");

    const r = await fetch(`http://localhost:3000/turmas/listar/${idDisciplina}`);
    const turmas = await r.json();

    selectTurma.innerHTML = "";

    turmas.forEach(t => {
        const op = document.createElement("option");
        op.value = t.ID_TURMA;
        op.textContent = `${t.NOME} (${t.CODIGO})`;
        selectTurma.appendChild(op);
    });

    selectTurma.addEventListener("change", carregarAlunos);
    carregarAlunos();
}

// 4. Carregar alunos
async function carregarAlunos() {
    const idTurma = document.getElementById("select-turma").value;

    const listaContainer = document.getElementById("lista-alunos");
    const msgVazia = document.getElementById("msg-lista-vazia-alunos");

    const r = await fetch(`http://localhost:3000/alunos/listar/${idTurma}`);
    const alunos = await r.json();

    listaContainer.innerHTML = "";

    if (!alunos || alunos.length === 0) {
        msgVazia.style.display = "block";
        return;
    }

    msgVazia.style.display = "none";

    alunos.forEach(a => {
        adicionarAlunoNaLista(listaContainer, a.NOME, a.MATRICULA);
    });
}

// 5. Monta a lista
function adicionarAlunoNaLista(container, nome, RA) {
    const divItem = document.createElement("div");
    divItem.className = "list-item";

    const strongNome = document.createElement("strong");
    strongNome.textContent = `${nome} (RA: ${RA})`;

    const linkNotas = document.createElement("a");
    linkNotas.href = "#";
    linkNotas.textContent = "Ver Notas";

    divItem.appendChild(strongNome);
    divItem.appendChild(linkNotas);

    container.appendChild(divItem);
}

// 6. Logout
function logout() {
    localStorage.removeItem("docenteName");
    localStorage.removeItem("docenteEmail");
    window.location.href = "login.html";
}
