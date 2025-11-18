/* Autores: Felipe Batista Bastos */

// Este arquivo contém as funções JavaScript para o cadastro de disciplinas.
// Ele lida com a interação do usuário na página de cadastro de disciplinas, enviando os dados para o backend e atualizando a interface.

// Função assíncrona para salvar uma nova disciplina.
// Captura os valores dos campos de nome, sigla, código e período, valida-os e os envia para o endpoint /disciplinas do backend.
// Em caso de sucesso, exibe uma mensagem e limpa os campos do formulário.

// Carregar cursos do docente ao abrir a página
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

// Carrega somente os cursos das instituições do docente
async function carregarCursos() {
    const select = document.getElementById("select-curso");

    const docenteEmail = localStorage.getItem("docenteEmail");

    // Carregar instituições que o docente pertence
    const rInst = await fetch(`http://localhost:3000/instituicoes/listar?docenteEmail=${encodeURIComponent(docenteEmail)}`);
    const instituicoes = await rInst.json();

    select.innerHTML = "";

    if (!instituicoes || instituicoes.length === 0) {
        const op = document.createElement("option");
        op.value = "";
        op.textContent = "Nenhuma instituição encontrada";
        select.appendChild(op);
        select.disabled = true;
        return;
    }

    // Carregar cursos de cada instituição
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
}

// Salvar disciplina
async function salvarDisciplina(event) {
    // Impede o envio padrão do formulário
    event.preventDefault();

    // Captura e limpa os valores dos campos do formulário
    const nome = document.getElementById("nome_disciplina").value.trim();
    const sigla = document.getElementById("sigla_disciplina").value.trim();
    const codigo = document.getElementById("codigo_disciplina").value.trim();
    const periodo = document.getElementById("periodo_disciplina").value.trim();
    const idCurso = document.getElementById("select-curso").value;

    // Valida campos obrigatórios
    if (!nome || !sigla || !codigo) {
        alert("Preencha Nome, Sigla e Código.");
        return;
    }

    // Valida se um curso foi selecionado
    if (!idCurso) {
        alert("Selecione um curso!");
        return;
    }

    // Monta objeto com dados da disciplina
    const dados = { nome, sigla, codigo, periodo, idCurso };

    try {
        // Envia dados ao backend para cadastro
        const resposta = await fetch("http://localhost:3000/disciplinas/cadastro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        const json = await resposta.json();

        // Feedback ao usuário baseado na resposta
        if (json.success) {
            alert("Disciplina cadastrada!");
            window.location.href = "disciplina.html";
        } else {
            alert("Erro: " + json.error);
        }
    } catch (err) {
        alert("Erro ao cadastrar disciplina: " + err.message);
        console.error(err);
    }
}

// Logout
function logout() {
    localStorage.removeItem("docenteName");
    localStorage.removeItem("docenteEmail");
    window.location.href = "login.html";
}
