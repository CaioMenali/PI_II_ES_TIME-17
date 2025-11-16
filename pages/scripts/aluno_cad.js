/* Autor: Felipe Batista batos */

// Este arquivo contém as funções JavaScript para o cadastro de alunos.
// Ele lida com a interação do usuário na página de cadastro de alunos, enviando os dados para o backend e atualizando a interface.

const listaContainer = document.getElementById("lista-alunos");
const msgVazia = document.getElementById("msg-lista-vazia-alunos");

// Função assíncrona para salvar um novo aluno.
// Captura os valores dos campos de nome e RA, valida-os e os envia para o endpoint /alunos do backend.
// Em caso de sucesso, exibe uma mensagem, adiciona o aluno à lista e limpa os campos do formulário.
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

// Função assíncrona para carregar e exibir a lista de alunos cadastrados.
// Faz uma requisição ao endpoint /alunos/listar do backend e preenche a lista na interface.
// Se não houver alunos, exibe uma mensagem de lista vazia.
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

// Função para adicionar visualmente um aluno à lista exibida na página.
// Cria elementos HTML para representar o aluno e os anexa ao container da lista.
// Parâmetros:
//   - dados: Objeto contendo as propriedades 'nome' e 'RA' do aluno.
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

// Esta função é executada quando a janela é carregada.
// Ela verifica se o usuário está logado (pelo nome do docente no localStorage) e redireciona para a página de login se não estiver.
// Além disso, ela exibe o nome do docente logado na interface.
window.onload = function() {
    var docenteDisplay = document.getElementById('docenteDisplay');
    if(!docenteDisplay) return;
    var nome = localStorage.getItem('docenteName');
    if(nome){ docenteDisplay.textContent = nome; } 
    else { window.location.href = 'login.html'; }
};

// Função para realizar o logout do docente.
// Remove as informações de login (nome e e-mail) do localStorage e redireciona o usuário para a página de login.
function logout() {
    localStorage.removeItem('docenteName');
    localStorage.removeItem('docenteEmail');
    window.location.href = 'login.html';
}