const form = document.getElementById("form-cad-aluno");
const inputNome = document.getElementById("nome_aluno");
const inputRA = document.getElementById("RA_aluno");
const listaContainer = document.getElementById("lista-alunos");
const msgVazia = document.getElementById("msg-lista-vazia-alunos");

document.addEventListener("DOMContentLoaded", carregarAlunos);

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const dados = {
        nome: inputNome.value.trim(),
        RA: inputRA.value.trim(),
    };

    if (dados.nome === "" || dados.RA === "") {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const r = await fetch("http://localhost:3000/alunos", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dados)
    });

    const resposta = await r.json();

    if (resposta.success) {
        alert("Aluno cadastrado com sucesso!");
        adicionarAlunoNaLista(dados);
        inputNome.value = "";
        inputRA.value = "";
    } else {
        alert("Erro ao salvar aluno: " + resposta.message);
    }
});

async function carregarAlunos() {
    const r = await fetch("http://localhost:3000/alunos/listar");
    const lista = await r.json();

    listaContainer.innerHTML = "";

    if (lista.length === 0) {
        msgVazia.style.display = "block";
        return;
    }

    msgVazia.style.display = "none";

    lista.forEach(a => {
        adicionarAlunoNaLista({ nome: a[2], RA: a[1] }); 
    });
}

function adicionarAlunoNaLista(dados) {
    if (msgVazia) msgVazia.style.display = "none";

    const divItem = document.createElement("div");
    divItem.className = "list-item";

    const strongNome = document.createElement("strong");
    strongNome.textContent = `${dados.nome} (${dados.RA})`;

    const linkTurmas = document.createElement("a");
    linkTurmas.href = "#";
    linkTurmas.textContent = "Ver Turmas";

    divItem.appendChild(strongNome);
    divItem.appendChild(linkTurmas);

    listaContainer.appendChild(divItem);
}