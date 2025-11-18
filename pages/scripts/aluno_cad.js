/* Autor: Felipe Batista batos */

// Este arquivo contém as funções JavaScript para o cadastro de alunos.
// Ele lida com a interação do usuário na página de cadastro de alunos, enviando os dados para o backend e atualizando a interface.

window.onload = async () => {
    // Pega nome e email do docente salvos no navegador
    const nome = localStorage.getItem("docenteName");
    const email = localStorage.getItem("docenteEmail");

    // Se não houver login, manda pra tela de login
    if (!nome || !email) {
        window.location.href = "login.html";
        return;
    }

    // Mostra o nome do docente na tela
    document.getElementById("docenteDisplay").textContent = nome;

    // Carrega a lista de cursos que ele pode acessar
    await carregarCursos();
};

// Carrega os cursos disponíveis para o docente logado
async function carregarCursos() {
    // Referência ao <select> de cursos na página
    const selectCurso = document.getElementById("select-curso");
    // Email do docente armazenado no localStorage
    const docenteEmail = localStorage.getItem("docenteEmail");

    // Busca as instituições vinculadas ao docente
    const rInst = await fetch(`http://localhost:3000/instituicoes/listar?docenteEmail=${encodeURIComponent(docenteEmail)}`);
    const instituicoes = await rInst.json();

    // Limpa as opções anteriores do select
    selectCurso.innerHTML = "";

    // Para cada instituição, busca seus cursos e adiciona como opção
    for (let inst of instituicoes) {
        const rCurso = await fetch(`http://localhost:3000/cursos/listar/${inst.ID_INSTITUICAO}`);
        const cursos = await rCurso.json();

        cursos.forEach(c => {
            const op = document.createElement("option");
            op.value = c.ID_CURSO;
            // Exibe nome do curso e da instituição entre parênteses
            op.textContent = `${c.NOME} (${inst.NOME})`;
            selectCurso.appendChild(op);
        });
    }

    // Registra evento para carregar disciplinas quando mudar o curso
    selectCurso.addEventListener("change", carregarDisciplinas);
    // Carrega as disciplinas do curso já selecionado
    carregarDisciplinas();
}

// Carrega as disciplinas do curso selecionado
async function carregarDisciplinas() {
    // Pega o ID do curso atualmente escolhido
    const idCurso = document.getElementById("select-curso").value;
    // Referência ao <select> de disciplinas
    const selectDisc = document.getElementById("select-disciplina");

    // Busca as disciplinas no backend
    const r = await fetch(`http://localhost:3000/disciplinas/listar/${idCurso}`);
    const disciplinas = await r.json();

    // Limpa as opções anteriores
    selectDisc.innerHTML = "";

    // Adiciona cada disciplina como uma nova opção
    disciplinas.forEach(d => {
        const op = document.createElement("option");
        op.value = d.ID_DISCIPLINA;
        op.textContent = `${d.NOME} (${d.CODIGO})`;
        selectDisc.appendChild(op);
    });

    // Registra o evento para carregar turmas quando mudar a disciplina
    selectDisc.addEventListener("change", carregarTurmas);
    // Carrega as turmas da disciplina já selecionada
    carregarTurmas();
}

// Carrega as turmas disponíveis para a disciplina selecionada
async function carregarTurmas() {
    // Obtém o ID da disciplina atualmente selecionada
    const idDisciplina = document.getElementById("select-disciplina").value;
    // Referência ao elemento <select> de turmas
    const selectTurma = document.getElementById("select-turma");

    // Busca as turmas no backend
    const r = await fetch(`http://localhost:3000/turmas/listar/${idDisciplina}`);
    const turmas = await r.json();

    // Limpa as opções anteriores
    selectTurma.innerHTML = "";

    // Adiciona cada turma como uma nova opção
    turmas.forEach(t => {
        const op = document.createElement("option");
        op.value = t.ID_TURMA;
        op.textContent = `${t.NOME} (${t.CODIGO})`;
        selectTurma.appendChild(op);
    });
}

// Salvar aluno na turma
document.getElementById("form-cad-aluno").addEventListener("submit", async (e) => {
    e.preventDefault(); // Impede o envio padrão do formulário

    // Captura e limpa os valores dos campos
    const nome = document.getElementById("nome_aluno").value.trim();
    const matricula = document.getElementById("matricula_aluno").value.trim();
    const idTurma = document.getElementById("select-turma").value;

    // Monta o objeto com os dados do aluno
    const dados = { nome, matricula, idTurma };

    // Envia os dados para o backend
    const resp = await fetch("http://localhost:3000/alunos/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    // Processa a resposta
    const json = await resp.json();
    if (json.success) {
        alert("Aluno cadastrado!");
        window.location.href = "aluno.html"; // Redireciona para a listagem
    } else {
        alert("Erro: " + json.error); // Exibe mensagem de erro
    }
});
