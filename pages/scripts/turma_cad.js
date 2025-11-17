/* Autor: Felipe Batista Bastos */

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

// Carrega os cursos das instituições do docente
async function carregarCursos() {
    const selectCurso = document.getElementById("select-curso");
    const docenteEmail = localStorage.getItem("docenteEmail");

    const rInst = await fetch(`http://localhost:3000/instituicoes/listar?docenteEmail=${encodeURIComponent(docenteEmail)}`);
    const instituicoes = await rInst.json();

    selectCurso.innerHTML = "";

    if (!instituicoes || instituicoes.length === 0) {
        selectCurso.innerHTML = "<option>Nenhuma instituição encontrada</option>";
        selectCurso.disabled = true;
        return;
    }

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

// Carrega disciplinas do curso selecionado
async function carregarDisciplinas() {
    const selectCurso = document.getElementById("select-curso");
    const selectDisciplina = document.getElementById("select-disciplina");
    const idCurso = selectCurso.value;

    const r = await fetch(`http://localhost:3000/disciplinas/listar/${idCurso}`);
    const disciplinas = await r.json();

    selectDisciplina.innerHTML = "";

    if (!disciplinas || disciplinas.length === 0) {
        const op = document.createElement("option");
        op.value = "";
        op.textContent = "Sem disciplinas cadastradas";
        selectDisciplina.appendChild(op);
        return;
    }

    disciplinas.forEach(d => {
        const op = document.createElement("option");
        op.value = d.ID_DISCIPLINA;
        op.textContent = `${d.NOME} (${d.CODIGO})`;
        selectDisciplina.appendChild(op);
    });
}

// Salvar turma
document.getElementById("form-cad-turma").addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome_turma").value.trim();
    const codigo = document.getElementById("codigo_turma").value.trim();
    const idDisciplina = document.getElementById("select-disciplina").value;

    if (!nome || !codigo) {
        alert("Preencha Nome e Código.");
        return;
    }

    if (!idDisciplina) {
        alert("Selecione uma disciplina!");
        return;
    }

    const dados = { nome, codigo, idDisciplina };

    const resp = await fetch("http://localhost:3000/turmas/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    const json = await resp.json();

    if (json.success) {
        alert("Turma cadastrada!");
        window.location.href = "turma.html";
    } else {
        alert("Erro: " + json.error);
    }
});

// Logout
function logout() {
    localStorage.removeItem("docenteName");
    localStorage.removeItem("docenteEmail");
    window.location.href = "login.html";
}