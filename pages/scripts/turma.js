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

// Carrega os cursos associados ao docente logado e os exibe no select
async function carregarCursos() {
    // Referência ao campo de seleção de curso
    const selectCurso = document.getElementById("select-curso");
    // Obtém o email do docente armazenado no localStorage
    const docenteEmail = localStorage.getItem("docenteEmail");

    // Busca as instituições vinculadas ao docente
    const rInst = await fetch(
        `http://localhost:3000/instituicoes/listar?docenteEmail=${encodeURIComponent(docenteEmail)}`
    );
    const instituicoes = await rInst.json();

    // Se não houver instituições, desabilita o select e avisa o usuário
    if (!instituicoes || instituicoes.length === 0) {
        selectCurso.innerHTML = "<option>Nenhuma instituição encontrada</option>";
        selectCurso.disabled = true;
        return;
    }

    // Limpa as opções anteriores do select
    selectCurso.innerHTML = "";

    // Para cada instituição, busca seus cursos
    for (let inst of instituicoes) {
        const rCurso = await fetch(
            `http://localhost:3000/cursos/listar/${inst.ID_INSTITUICAO}`
        );
        const cursos = await rCurso.json();

        // Adiciona cada curso como uma opção no select
        cursos.forEach(c => {
            const op = document.createElement("option");
            op.value = c.ID_CURSO;
            // Exibe o nome do curso e da instituição entre parênteses
            op.textContent = `${c.NOME} (${inst.NOME})`;
            selectCurso.appendChild(op);
        });
    }

    // Define o evento para carregar disciplinas quando o curso mudar
    selectCurso.addEventListener("change", carregarDisciplinas);
    // Carrega as disciplinas do curso já selecionado
    carregarDisciplinas();
}


// Carrega e exibe as disciplinas do curso selecionado
async function carregarDisciplinas() {
    // Pega o ID do curso selecionado no campo <select>
    const idCurso = document.getElementById("select-curso").value;
    const selectDisciplina = document.getElementById("select-disciplina");

    // Busca as disciplinas do curso no backend
    const r = await fetch(`http://localhost:3000/disciplinas/listar/${idCurso}`);
    const disciplinas = await r.json();

    // Limpa as opções anteriores do select de disciplinas
    selectDisciplina.innerHTML = "";

    // Se não houver disciplinas, exibe uma opção avisando
    if (!disciplinas || disciplinas.length === 0) {
        selectDisciplina.innerHTML = "<option>Nenhuma disciplina encontrada</option>";
        return;
    }

    // Adiciona cada disciplina como uma nova opção no select
    disciplinas.forEach(d => {
        const op = document.createElement("option");
        op.value = d.ID_DISCIPLINA;
        op.textContent = `${d.NOME} (${d.CODIGO})`;
        selectDisciplina.appendChild(op);
    });

    // Ativa o evento para carregar turmas ao trocar de disciplina
    selectDisciplina.addEventListener("change", carregarTurmas);
    // Carrega as turmas da disciplina já selecionada
    carregarTurmas();
}

// Carrega e exibe as turmas da disciplina selecionada
async function carregarTurmas() {
    // Obtém o ID da disciplina atualmente selecionada
    const idDisciplina = document.getElementById("select-disciplina").value;

    // Referências aos elementos da interface
    const lista = document.getElementById("lista-turmas");
    const msgVazia = document.getElementById("msg-lista-vazia-turmas");

    // Requisição ao backend para buscar turmas da disciplina
    const r = await fetch(
        `http://localhost:3000/turmas/listar/${idDisciplina}`
    );
    const turmas = await r.json();

    // Limpa a lista antes de preencher
    lista.innerHTML = "";

    // Se não houver turmas, exibe mensagem de lista vazia
    if (!turmas || turmas.length === 0) {
        msgVazia.style.display = "block";
        return;
    }

    // Oculta mensagem de lista vazia e preenche com turmas
    msgVazia.style.display = "none";

    turmas.forEach(t => {
        adicionarTurmaNaLista(t.ID_TURMA, t.NOME, t.CODIGO);
    });
}

// Adicionar uma turma à lista visual
function adicionarTurmaNaLista(id, nome, codigo) {
    // Referência ao container da lista de turmas
    const lista = document.getElementById("lista-turmas");

    // Cria o elemento que representa uma turma
    const divItem = document.createElement("div");
    divItem.className = "list-item";

    // Exibe o nome e código da turma em negrito
    const strongNome = document.createElement("strong");
    strongNome.textContent = `${nome} (${codigo})`;

    // Link para visualizar os alunos da turma
    const link = document.createElement("a");
    link.href = "aluno.html";
    link.textContent = "Ver Alunos";

    // Monta o item e o insere na lista
    divItem.appendChild(strongNome);
    divItem.appendChild(link);
    lista.appendChild(divItem);
}

// Logout
function logout() {
    localStorage.removeItem("docenteName");
    localStorage.removeItem("docenteEmail");
    window.location.href = "login.html";
}

// Função para redirecionar o usuário para a página inicial.
function voltarParaInicio() {
    window.location.href = "index.html";
}