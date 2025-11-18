/* Autor: Felipe Batista Bastos */

// Este arquivo contém as funções JavaScript para a listagem de turmas.
// Ele é responsável por carregar e exibir a lista de turmas cadastradas na interface do usuário.



// Função assíncrona para carregar e exibir a lista de turmas.
// Faz uma requisição ao endpoint /turmas/listar do backend e preenche a lista na interface.
// Se não houver turmas, exibe uma mensagem de lista vazia.
//  AO CARREGAR A PÁGINA
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


// CARREGAR CURSOS DO DOCENTE

async function carregarCursos() {
    const selectCurso = document.getElementById("select-curso");
    const docenteEmail = localStorage.getItem("docenteEmail");

    const rInst = await fetch(
        `http://localhost:3000/instituicoes/listar?docenteEmail=${encodeURIComponent(docenteEmail)}`
    );
    const instituicoes = await rInst.json();

    if (!instituicoes || instituicoes.length === 0) {
        selectCurso.innerHTML = "<option>Nenhuma instituição encontrada</option>";
        selectCurso.disabled = true;
        return;
    }

    selectCurso.innerHTML = "";

    for (let inst of instituicoes) {
        const rCurso = await fetch(
            `http://localhost:3000/cursos/listar/${inst.ID_INSTITUICAO}`
        );
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


// CARREGAR DISCIPLINAS DO CURSO SELECIONADO

async function carregarDisciplinas() {
    const idCurso = document.getElementById("select-curso").value;
    const selectDisciplina = document.getElementById("select-disciplina");

    const r = await fetch(`http://localhost:3000/disciplinas/listar/${idCurso}`);
    const disciplinas = await r.json();

    selectDisciplina.innerHTML = "";

    if (!disciplinas || disciplinas.length === 0) {
        selectDisciplina.innerHTML = "<option>Nenhuma disciplina encontrada</option>";
        return;
    }

    disciplinas.forEach(d => {
        const op = document.createElement("option");
        op.value = d.ID_DISCIPLINA;
        op.textContent = `${d.NOME} (${d.CODIGO})`;
        selectDisciplina.appendChild(op);
    });

    selectDisciplina.addEventListener("change", carregarTurmas);
    carregarTurmas();
}
// CARREGAR TURMAS DA DISCIPLINA

async function carregarTurmas() {
    const idDisciplina = document.getElementById("select-disciplina").value;

    const lista = document.getElementById("lista-turmas");
    const msgVazia = document.getElementById("msg-lista-vazia-turmas");

    const r = await fetch(
        `http://localhost:3000/turmas/listar/${idDisciplina}`
    );
    const turmas = await r.json();

    lista.innerHTML = "";

    if (!turmas || turmas.length === 0) {
        msgVazia.style.display = "block";
        return;
    }

    msgVazia.style.display = "none";

    turmas.forEach(t => {
        adicionarTurmaNaLista(t.ID_TURMA, t.NOME, t.CODIGO);
    });
}

// ADICIONAR TURMA NA LISTA VISUAL

function adicionarTurmaNaLista(id, nome, codigo) {
    const lista = document.getElementById("lista-turmas");

    const divItem = document.createElement("div");
    divItem.className = "list-item";

    const strongNome = document.createElement("strong");
    strongNome.textContent = `${nome} (${codigo})`;

    const link = document.createElement("a");
    link.href = "aluno.html";
    link.textContent = "Ver Alunos";

    divItem.appendChild(strongNome);
    divItem.appendChild(link);
    lista.appendChild(divItem);
}
// LOGOUT

function logout() {
    localStorage.removeItem("docenteName");
    localStorage.removeItem("docenteEmail");
    window.location.href = "login.html";
}

// Função para redirecionar o usuário para a página inicial.
function voltarParaInicio() {
    window.location.href = "index.html";
}