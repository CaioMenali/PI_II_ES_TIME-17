/* Autor: Felipe Batista batos */

// Este arquivo contém as funções JavaScript para o cadastro de alunos.
// Ele lida com a interação do usuário na página de cadastro de alunos, enviando os dados para o backend e atualizando a interface.

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

// Função assíncrona para salvar um novo aluno.
// Captura os valores dos campos de nome e RA, valida-os e os envia para o endpoint /alunos do backend.
// Em caso de sucesso, exibe uma mensagem, adiciona o aluno à lista e limpa os campos do formulário.
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
}

// 4. Salvar aluno na turma
document.getElementById("form-cad-aluno").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome_aluno").value.trim();
    const matricula = document.getElementById("matricula_aluno").value.trim();
    const idTurma = document.getElementById("select-turma").value;

    const dados = { nome, matricula, idTurma };

    const resp = await fetch("http://localhost:3000/alunos/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    const json = await resp.json();
    if (json.success) {
        alert("Aluno cadastrado!");
        window.location.href = "aluno.html";
    } else {
        alert("Erro: " + json.error);
    }
});