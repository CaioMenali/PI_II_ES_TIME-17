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
    // Obtém o elemento select de cursos e o email do docente logado
    const selectCurso = document.getElementById("select-curso");
    const docenteEmail = localStorage.getItem("docenteEmail");

    // Busca as instituições associadas ao docente
    const rInst = await fetch(`http://localhost:3000/instituicoes/listar?docenteEmail=${encodeURIComponent(docenteEmail)}`);
    const instituicoes = await rInst.json();

    // Limpa as opções anteriores do select
    selectCurso.innerHTML = "";

    // Se não houver instituições, exibe mensagem e desabilita o campo
    if (!instituicoes || instituicoes.length === 0) {
        selectCurso.innerHTML = "<option>Nenhuma instituição encontrada</option>";
        selectCurso.disabled = true;
        return;
    }

    // Para cada instituição, busca seus cursos e adiciona ao select
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

    // Adiciona listener para carregar disciplinas ao mudar de curso
    selectCurso.addEventListener("change", carregarDisciplinas);
    // Carrega disciplinas do curso inicialmente selecionado
    carregarDisciplinas();
}

// Carrega disciplinas do curso selecionado
async function carregarDisciplinas() {
    // Obtém o curso escolhido e o combo de disciplinas
    const selectCurso = document.getElementById("select-curso");
    const selectDisciplina = document.getElementById("select-disciplina");
    const idCurso = selectCurso.value;

    // Busca disciplinas do curso no servidor
    const r = await fetch(`http://localhost:3000/disciplinas/listar/${idCurso}`);
    const disciplinas = await r.json();

    // Limpa opções anteriores
    selectDisciplina.innerHTML = "";

    // Se não houver disciplinas, exibe aviso
    if (!disciplinas || disciplinas.length === 0) {
        const op = document.createElement("option");
        op.value = "";
        op.textContent = "Sem disciplinas cadastradas";
        selectDisciplina.appendChild(op);
        return;
    }

    // Adiciona cada disciplina como uma opção no combo
    disciplinas.forEach(d => {
        const op = document.createElement("option");
        op.value = d.ID_DISCIPLINA;
        op.textContent = `${d.NOME} (${d.CODIGO})`;
        selectDisciplina.appendChild(op);
    });
}

// Salvar turma
document.getElementById("form-cad-turma").addEventListener("submit", async (event) => {
    // Evita o recarregamento da página
    event.preventDefault();

    // Coleta os valores dos campos
    const nome = document.getElementById("nome_turma").value.trim();
    const codigo = document.getElementById("codigo_turma").value.trim();
    const idDisciplina = document.getElementById("select-disciplina").value;

    // Validações básicas
    if (!nome || !codigo) {
        alert("Preencha Nome e Código.");
        return;
    }

    if (!idDisciplina) {
        alert("Selecione uma disciplina!");
        return;
    }

    // Monta o objeto a ser enviado
    const dados = { nome, codigo, idDisciplina };

    // Envia os dados ao backend
    const resp = await fetch("http://localhost:3000/turmas/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    const json = await resp.json();

    // Feedback ao usuário
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