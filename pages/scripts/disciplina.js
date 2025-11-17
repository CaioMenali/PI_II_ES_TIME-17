/* Autores: Felipe Batista Bastos */

// Este arquivo contém as funções JavaScript para a listagem de disciplinas.
// Ele é responsável por carregar e exibir a lista de disciplinas cadastradas na interface do usuário.

// Função assíncrona para carregar e exibir a lista de disciplinas.
// Faz uma requisição ao endpoint /disciplinas/listar do backend e preenche a lista na interface.
// Se não houver disciplinas, exibe uma mensagem de lista vazia.

// Ao carregar a página
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

// Carrega todos os cursos do docente
async function carregarCursos() {
    const select = document.getElementById("select-curso");
    const docenteEmail = localStorage.getItem("docenteEmail");

    const rInst = await fetch(`http://localhost:3000/instituicoes/listar?docenteEmail=${encodeURIComponent(docenteEmail)}`);
    const instituicoes = await rInst.json();

    if (!instituicoes || instituicoes.length === 0) {
        select.innerHTML = "<option>Nenhuma instituição encontrada</option>";
        select.disabled = true;
        return;
    }

    select.innerHTML = "";

    for (let inst of instituicoes) {
        const rCurso = await fetch(`http://localhost:3000/cursos/listar/${inst.ID_INSTITUICAO}`);
        const cursos = await rCurso.json();

        cursos.forEach(c => {
            const op = document.createElement("option");
            op.value = c.ID_CURSO;
            op.textContent = `${c.NOME} (${inst.NOME})`;
            select.appendChild(op);
        });
    }

    select.addEventListener("change", carregarDisciplinas);
    carregarDisciplinas();
}

// Carrega disciplinas do curso selecionado
async function carregarDisciplinas() {
    const select = document.getElementById("select-curso");
    const idCurso = select.value;

    const lista = document.getElementById("lista-disciplinas");
    const msgVazia = document.getElementById("msg-lista-vazia-disciplinas");

    const r = await fetch(`http://localhost:3000/disciplinas/listar/${idCurso}`);
    const disciplinas = await r.json();

    lista.innerHTML = "";

    if (!disciplinas || disciplinas.length === 0) {
        msgVazia.style.display = "block";
        return;
    }

    msgVazia.style.display = "none";

    disciplinas.forEach(d => {
        adicionarDisciplinaNaLista(d.ID_DISCIPLINA, d.NOME, d.SIGLA, d.CODIGO, d.PERIODO);
    });
}

function adicionarDisciplinaNaLista(id, nome, sigla, codigo, periodo) {
    const lista = document.getElementById("lista-disciplinas");

    const divItem = document.createElement("div");
    divItem.className = "list-item";

    const strongNome = document.createElement("strong");
    strongNome.textContent = `${nome} (${codigo})`;

    const link = document.createElement("a");
    link.href = "turma.html";
    link.textContent = "Ver Turmas";

    divItem.appendChild(strongNome);
    divItem.appendChild(link);
    lista.appendChild(divItem);
}

function logout() {
    localStorage.removeItem("docenteName");
    localStorage.removeItem("docenteEmail");
    window.location.href = "login.html";
}
