/* Autores: Felipe Batista Bastos */

// Este arquivo contém as funções JavaScript para o cadastro de cursos.
// Ele lida com a interação do usuário na página de cadastro de cursos, incluindo o carregamento de instituições e o envio de dados para o backend.

// Esta função é executada quando a janela é carregada.
// Ela carrega a lista de instituições do backend e as preenche em um elemento select.
window.onload = async () => {

    const selectInst = document.getElementById("instituicao_select");

    const docenteEmail = localStorage.getItem("docenteEmail");
    const docenteNome = localStorage.getItem("docenteName");

    if (!docenteEmail) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("docenteDisplay").textContent = docenteNome;

    // Carrega somente as instituições do docente
    const r = await fetch(`http://localhost:3000/instituicoes/listar?docenteEmail=${encodeURIComponent(docenteEmail)}`);
    const lista = await r.json();

    selectInst.innerHTML = "";

    if (!lista || lista.length === 0) {
        const op = document.createElement("option");
        op.value = "";
        op.textContent = "Nenhuma instituição encontrada";
        selectInst.appendChild(op);
        selectInst.disabled = true;
        return;
    }

    lista.forEach(inst => {
        const op = document.createElement("option");
        op.value = inst.ID_INSTITUICAO;
        op.textContent = inst.NOME;
        selectInst.appendChild(op);
    });
};

// Esta função coleta os dados do formulário, como o nome do curso e o ID da instituição, e envia uma requisição POST para o backend para cadastrar o curso.
// Após o cadastro, exibe uma mensagem de sucesso ou erro, e redireciona o usuário para a página de cursos.
async function salvarCurso() {

    // Pega o nome do curso digitado no campo de texto
    const nome = document.getElementById("nome_curso").value;
    // Pega o ID da instituição selecionada no combo
    const idInst = document.getElementById("instituicao_select").value;

    // Envia os dados para o backend
    const r = await fetch("http://localhost:3000/cursos/cadastro", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            nome,
            idInstituicao: idInst
        })
    });

    // Aguarda a resposta do servidor
    const resposta = await r.json();

    // Se deu certo, avisa e volta para a lista de cursos
    if (resposta.success) {
        alert("Curso cadastrado com sucesso!");
        window.location.href = "curso.html";
    } else {
        // Se deu erro, mostra a mensagem
        alert("Erro: " + resposta.error);
    }
}

// Função para realizar o logout do docente.
function logout() {
    localStorage.removeItem("docenteName");
    localStorage.removeItem("docenteEmail");
    window.location.href = "login.html";
}

// Função para voltar à página de cursos.
function voltarParaCursos() {
    window.location.href = "curso.html";
}