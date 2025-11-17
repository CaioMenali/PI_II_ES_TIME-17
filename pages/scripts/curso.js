/* Autores: Felipe Batista Bastos */

// Este arquivo contém as funções JavaScript para a listagem de cursos.
// Ele é responsável por carregar e exibir a lista de cursos cadastrados, filtrados por instituição, na interface do usuário.

// Função assíncrona para carregar e exibir a lista de instituições.
// Faz uma requisição ao endpoint /instituicoes/listar do backend e preenche um elemento select com as instituições.
// Também configura um evento de mudança para o select, que recarrega os cursos quando uma nova instituição é selecionada.
async function carregarInstituicoes() {
    const select = document.getElementById("select-instituicao");
    select.innerHTML = "";

    const docenteEmail = localStorage.getItem("docenteEmail");
    if (!docenteEmail) {
        window.location.href = "login.html";
        return;
    }

    const r = await fetch(`http://localhost:3000/instituicoes/listar?docenteEmail=${encodeURIComponent(docenteEmail)}`);
    const lista = await r.json();

    if (!lista || lista.length === 0) {
        const op = document.createElement("option");
        op.value = "";
        op.textContent = "Nenhuma instituição encontrada";
        select.appendChild(op);
        select.disabled = true;
        return;
    }

    lista.forEach(inst => {
        const op = document.createElement("option");
        op.value = inst.ID_INSTITUICAO;
        op.textContent = inst.NOME;
        select.appendChild(op);
    });

    select.addEventListener("change", carregarCursos);
    carregarCursos();
}

async function carregarCursos() {
    const select = document.getElementById("select-instituicao");
    const idInst = select.value;

    const listaContainer = document.getElementById("lista-cursos");
    const msgVazia = document.getElementById("msg-lista-vazia-cursos");

    const r = await fetch(`http://localhost:3000/cursos/listar/${idInst}`);
    const lista = await r.json();

    listaContainer.innerHTML = "";

    if (!lista || lista.length === 0) {
        msgVazia.style.display = "block";
        return;
    }

    msgVazia.style.display = "none";

    lista.forEach(c => {
        adicionarCursoNaLista(c.ID_CURSO, c.NOME);
    });
}

function adicionarCursoNaLista(id, nome) {
    const listaContainer = document.getElementById("lista-cursos");

    const divItem = document.createElement("div");
    divItem.className = "list-item";

    const strongNome = document.createElement("strong");
    strongNome.textContent = nome;

    const link = document.createElement("a");
    link.href = "disciplina.html";
    link.textContent = "Ver Disciplinas";

    divItem.appendChild(strongNome);
    divItem.appendChild(link);

    listaContainer.appendChild(divItem);
}

window.onload = function() {
    const nome = localStorage.getItem("docenteName");
    const display = document.getElementById("docenteDisplay");
    if (!nome) window.location.href = "login.html";
    else display.textContent = nome;

    carregarInstituicoes();
};

function logout() {
    localStorage.removeItem("docenteName");
    localStorage.removeItem("docenteEmail");
    window.location.href = "login.html";
}