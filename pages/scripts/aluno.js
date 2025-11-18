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

// Carrega cursos
async function carregarCursos() {
    const selectCurso = document.getElementById("select-curso");
    const docenteEmail = localStorage.getItem("docenteEmail");

    // Busca as instituições associadas ao docente logado
    const rInst = await fetch(`http://localhost:3000/instituicoes/listar?docenteEmail=${encodeURIComponent(docenteEmail)}`);
    const instituicoes = await rInst.json();

    // Limpa o select antes de preencher
    selectCurso.innerHTML = "";

    // Para cada instituição, busca os cursos e adiciona como opção
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

    // Configura evento para carregar disciplinas ao trocar de curso
    selectCurso.addEventListener("change", carregarDisciplinas);
    carregarDisciplinas();
}
// Carrega as disciplinas do curso selecionado
async function carregarDisciplinas() {
    // Obtém o ID do curso escolhido no select
    const idCurso = document.getElementById("select-curso").value;
    const selectDisc = document.getElementById("select-disciplina");

    // Busca as disciplinas do curso no backend
    const r = await fetch(`http://localhost:3000/disciplinas/listar/${idCurso}`);
    const disciplinas = await r.json();

    // Limpa o select antes de preencher
    selectDisc.innerHTML = "";

    // Adiciona cada disciplina como uma opção
    disciplinas.forEach(d => {
        const op = document.createElement("option");
        op.value = d.ID_DISCIPLINA;
        op.textContent = `${d.NOME} (${d.CODIGO})`;
        selectDisc.appendChild(op);
    });

    // Quando mudar a disciplina, recarrega a lista de turmas
    selectDisc.addEventListener("change", carregarTurmas);
    carregarTurmas();
}

// Carregar turmas
async function carregarTurmas() {
    // Pega o ID da disciplina selecionada
    const idDisciplina = document.getElementById("select-disciplina").value;
    const selectTurma = document.getElementById("select-turma");

    // Busca as turmas da disciplina no backend
    const r = await fetch(`http://localhost:3000/turmas/listar/${idDisciplina}`);
    const turmas = await r.json();

    // Limpa o select antes de preencher
    selectTurma.innerHTML = "";

    // Adiciona cada turma como uma opção
    turmas.forEach(t => {
        const op = document.createElement("option");
        op.value = t.ID_TURMA;
        op.textContent = `${t.NOME} (${t.CODIGO})`;
        selectTurma.appendChild(op);
    });

    // Quando mudar a turma, recarrega a lista de alunos
    selectTurma.addEventListener("change", carregarAlunos);
    carregarAlunos();
}

// Carrega e exibe os alunos matriculados na turma selecionada
async function carregarAlunos() {
    // Obtém o ID da turma escolhida no select
    const idTurma = document.getElementById("select-turma").value;

    // Referências ao container da lista e à mensagem de lista vazia
    const listaContainer = document.getElementById("lista-alunos");
    const msgVazia = document.getElementById("msg-lista-vazia-alunos");

    // Busca os alunos da turma no backend
    const r = await fetch(`http://localhost:3000/alunos/listar/${idTurma}`);
    const alunos = await r.json();

    // Limpa a lista antes de preenchê-la
    listaContainer.innerHTML = "";

    // Se não houver alunos, mostra a mensagem de lista vazia
    if (!alunos || alunos.length === 0) {
        msgVazia.style.display = "block";
        return;
    }

    // Esconde a mensagem de lista vazia
    msgVazia.style.display = "none";

    // Adiciona cada aluno na interface
    alunos.forEach(a => {
        adicionarAlunoNaLista(listaContainer, a.NOME, a.MATRICULA);
    });
}

// Adiciona um aluno à lista visual na interface
function adicionarAlunoNaLista(container, nome, RA) {
    // Cria o elemento que representa o aluno na lista
    const divItem = document.createElement("div");
    divItem.className = "list-item";

    // Exibe o nome e o RA do aluno em negrito
    const strongNome = document.createElement("strong");
    strongNome.textContent = `${nome} (RA: ${RA})`;

    // Link para acessar as notas do aluno (placeholder, sem ação por enquanto)
    const linkNotas = document.createElement("a");
    linkNotas.href = "#";
    linkNotas.textContent = "Ver Notas";

    // Monta a estrutura do item e o adiciona ao container
    divItem.appendChild(strongNome);
    divItem.appendChild(linkNotas);

    container.appendChild(divItem);
}

// Logout
function logout() {
    localStorage.removeItem("docenteName");
    localStorage.removeItem("docenteEmail");
    window.location.href = "login.html";
}

// Função para redirecionar o usuário para a página inicial.
function voltarParaTurmas() {
    window.location.href = "turma.html";
}