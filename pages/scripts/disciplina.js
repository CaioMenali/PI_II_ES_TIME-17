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
    // Obtém o elemento <select> onde os cursos serão listados
    const select = document.getElementById("select-curso");
    // Recupera o e-mail do docente armazenado no localStorage
    const docenteEmail = localStorage.getItem("docenteEmail");

    // Busca as instituições vinculadas ao docente
    const rInst = await fetch(`http://localhost:3000/instituicoes/listar?docenteEmail=${encodeURIComponent(docenteEmail)}`);
    const instituicoes = await rInst.json();

    // Se não houver instituições, desabilita o select e exibe mensagem
    if (!instituicoes || instituicoes.length === 0) {
        select.innerHTML = "<option>Nenhuma instituição encontrada</option>";
        select.disabled = true;
        return;
    }

    // Limpa as opções anteriores do select
    select.innerHTML = "";

    // Para cada instituição, busca os cursos correspondentes
    for (let inst of instituicoes) {
        const rCurso = await fetch(`http://localhost:3000/cursos/listar/${inst.ID_INSTITUICAO}`);
        const cursos = await rCurso.json();

        // Adiciona cada curso como uma opção no select
        cursos.forEach(c => {
            const op = document.createElement("option");
            op.value = c.ID_CURSO;
            op.textContent = `${c.NOME} (${inst.NOME})`;
            select.appendChild(op);
        });
    }

    // Define o evento para carregar disciplinas quando o curso for alterado
    select.addEventListener("change", carregarDisciplinas);
    // Carrega as disciplinas do primeiro curso automaticamente
    carregarDisciplinas();
}

// Carrega disciplinas do curso selecionado
async function carregarDisciplinas() {
    // Obtém o ID do curso selecionado no dropdown
    const select = document.getElementById("select-curso");
    const idCurso = select.value;

    // Referência à lista de disciplinas e à mensagem de lista vazia
    const lista = document.getElementById("lista-disciplinas");
    const msgVazia = document.getElementById("msg-lista-vazia-disciplinas");

    // Busca disciplinas do curso no backend
    const r = await fetch(`http://localhost:3000/disciplinas/listar/${idCurso}`);
    const disciplinas = await r.json();

    // Limpa a lista antes de preencher
    lista.innerHTML = "";

    // Se não houver disciplinas, exibe mensagem e para
    if (!disciplinas || disciplinas.length === 0) {
        msgVazia.style.display = "block";
        return;
    }

    // Oculta mensagem de lista vazia
    msgVazia.style.display = "none";

    // Adiciona cada disciplina na interface
    disciplinas.forEach(d => {
        adicionarDisciplinaNaLista(d.ID_DISCIPLINA, d.NOME, d.SIGLA, d.CODIGO, d.PERIODO);
    });
}

// Função que cria e adiciona um item de disciplina na lista da interface
function adicionarDisciplinaNaLista(id, nome, sigla, codigo, periodo) {
    // Obtém o elemento da lista onde os itens serão inseridos
    const lista = document.getElementById("lista-disciplinas");

    // Cria um div para representar o item da lista
    const divItem = document.createElement("div");
    divItem.className = "list-item";

    // Cria um elemento <strong> para exibir o nome e o código da disciplina
    const strongNome = document.createElement("strong");
    strongNome.textContent = `${nome} (${codigo})`;

    // Cria um link que leva à página de turmas da disciplina
    const link = document.createElement("a");
    link.href = "turma.html";
    link.textContent = "Ver Turmas";

    // Monta a estrutura do item e o adiciona à lista
    divItem.appendChild(strongNome);
    divItem.appendChild(link);
    lista.appendChild(divItem);
}

// Função para fazer logout do docente.
function logout() {
    localStorage.removeItem("docenteName");
    localStorage.removeItem("docenteEmail");
    window.location.href = "login.html";
}

// Função para redirecionar o usuário para a página inicial.
function voltarParaInicio() {
    window.location.href = "index.html";
}