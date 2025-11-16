/* Autor: Felipe Batista batos */

const listaContainer = document.getElementById("lista-alunos");
const msgVazia = document.getElementById("msg-lista-vazia-alunos");

async function salvarAluno() {
    const inputNome = document.getElementById("nome_aluno");
    const inputRA = document.getElementById("RA_aluno");

    const dados = {
        nome: inputNome.value.trim(),
        RA: inputRA.value.trim(),
    };

    if (dados.nome === "" || dados.RA === "") {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/alunos", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            throw new Error("Requisição falhou com status: " + response.status);
        }

        const resposta = await response.json();

        if (resposta.success) {
            alert("Aluno cadastrado com sucesso!");
            adicionarAlunoNaLista(dados);
            inputNome.value = "";
            inputRA.value = "";
        } else {
            alert("Erro ao salvar aluno: " + resposta.message);
        }
    } catch (err) {
        alert("Ocorreu um erro inesperado ao salvar o aluno: " + err.message);
        console.error("Erro ao salvar aluno:", err);
    }
}

async function carregarAlunos() {
    const response = await fetch("http://localhost:3000/alunos/listar");
    const lista = await response.json();

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

window.onload = function() {
    var docenteDisplay = document.getElementById('docenteDisplay');
    if(!docenteDisplay) return;
    var nome = localStorage.getItem('docenteName');
    if(nome){ docenteDisplay.textContent = nome; } 
    else { window.location.href = 'login.html'; }
};

function logout() {
    localStorage.removeItem('docenteName');
    localStorage.removeItem('docenteEmail');
    window.location.href = 'login.html';
}