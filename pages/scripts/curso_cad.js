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

    // Carrega SOMENTE as instituições do docente
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

// Salvar curso
async function salvarCurso(event){
    event.preventDefault();

    const nome = document.getElementById("nome_curso").value;
    const idInst = document.getElementById("instituicao_select").value;

    const r = await fetch("http://localhost:3000/cursos/cadastro", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            nome,
            idInstituicao: idInst
        })
    });

    const resposta = await r.json();

    if (resposta.success) {
        alert("Curso cadastrado com sucesso!");
        window.location.href = "curso.html";
    } else {
        alert("Erro: " + resposta.error);
    }
}

function logout() {
    localStorage.removeItem("docenteName");
    localStorage.removeItem("docenteEmail");
    window.location.href = "login.html";
}