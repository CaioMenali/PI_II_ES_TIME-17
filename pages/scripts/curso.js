/* Autores: Felipe Batista Bastos */

// Este arquivo contém as funções JavaScript para a listagem de cursos.
// Ele é responsável por carregar e exibir a lista de cursos cadastrados, filtrados por instituição, na interface do usuário.

// Função assíncrona para carregar e exibir a lista de instituições.
// Faz uma requisição ao endpoint /instituicoes/listar do backend e preenche um elemento select com as instituições.
// Também configura um evento de mudança para o select, que recarrega os cursos quando uma nova instituição é selecionada.
async function carregarInstituicoes() {
    // Pega o elemento <select> que exibirá as instituições
    const select = document.getElementById("select-instituicao");
    select.innerHTML = "";

    // Verifica se o docente está logado pelo e-mail armazenado
    const docenteEmail = localStorage.getItem("docenteEmail");
    if (!docenteEmail) {
        window.location.href = "login.html";
        return;
    }

    // Busca no backend as instituições vinculadas ao docente
    const r = await fetch(`http://localhost:3000/instituicoes/listar?docenteEmail=${encodeURIComponent(docenteEmail)}`);
    const lista = await r.json();

    // Se não houver instituições, exibe opção avisando e desabilita o select
    if (!lista || lista.length === 0) {
        const op = document.createElement("option");
        op.value = "";
        op.textContent = "Nenhuma instituição encontrada";
        select.appendChild(op);
        select.disabled = true;
        return;
    }

    // Preenche o select com as instituições retornadas
    lista.forEach(inst => {
        const op = document.createElement("option");
        op.value = inst.ID_INSTITUICAO;
        op.textContent = inst.NOME;
        select.appendChild(op);
    });

    // Ao trocar de instituição, recarrega a lista de cursos
    select.addEventListener("change", carregarCursos);
    carregarCursos();
}

// Busca os cursos da instituição selecionada e os exibe na tela
async function carregarCursos() {
    const select = document.getElementById("select-instituicao");
    const idInst = select.value;

    const listaContainer = document.getElementById("lista-cursos");
    const msgVazia = document.getElementById("msg-lista-vazia-cursos");

    // Requisição ao backend para obter os cursos da instituição
    const r = await fetch(`http://localhost:3000/cursos/listar/${idInst}`);
    const lista = await r.json();

    // Limpa a lista antes de preencher
    listaContainer.innerHTML = "";

    // Se não houver cursos, exibe mensagem de lista vazia
    if (!lista || lista.length === 0) {
        msgVazia.style.display = "block";
        return;
    }

    msgVazia.style.display = "none";

    // Adiciona cada curso na interface
    lista.forEach(c => {
        adicionarCursoNaLista(c.ID_CURSO, c.NOME);
    });
}

// Cria e insere um item de curso na lista visível para o usuário
function adicionarCursoNaLista(id, nome) {
    // Referência ao container onde os cursos serão listados
    const listaContainer = document.getElementById("lista-cursos");

    // Cria a div que representa um item da lista
    const divItem = document.createElement("div");
    divItem.className = "list-item";

    // Cria o elemento strong para exibir o nome do curso em negrito
    const strongNome = document.createElement("strong");
    strongNome.textContent = nome;

    // Cria o link para a página de disciplinas do curso
    const link = document.createElement("a");
    link.href = "disciplina.html";
    link.textContent = "Ver Disciplinas";

    // Adiciona o nome e o link à div do item
    divItem.appendChild(strongNome);
    divItem.appendChild(link);

    // Insere o item na lista visível na página
    listaContainer.appendChild(divItem);
}

// Função executada ao carregar a página
// Verifica se o docente está logado e carrega as instituições
window.onload = function() {
    const nome = localStorage.getItem("docenteName");
    const display = document.getElementById("docenteDisplay");
    if (!nome) window.location.href = "login.html";
    else display.textContent = nome;

    carregarInstituicoes();
};

// Função para fazer logout do docente
function logout() {
    localStorage.removeItem("docenteName");
    localStorage.removeItem("docenteEmail");
    window.location.href = "login.html";
}

// Função para redirecionar o usuário para a página inicial.
function voltarParaInicio() {
    window.location.href = "index.html";
}