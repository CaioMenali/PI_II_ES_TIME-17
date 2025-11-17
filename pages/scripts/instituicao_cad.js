/* Autor: Felipe Cesar Ferreira Lirani */

// Este arquivo contém as funções JavaScript para o cadastro de instituições.
// Ele lida com a interação do usuário na página de cadastro de instituições, enviando os dados para o backend e associando-os a um docente.

// Função assíncrona para cadastrar uma nova instituição.
// Captura o nome da instituição e o e-mail do docente logado, valida-os e os envia para o endpoint /instituicoes do backend.
// Em caso de sucesso, exibe uma mensagem e redireciona para a página de instituições.
async function cadastrarInstituicao() {
    const inputNome = document.getElementById("nome");
    const nomeInstituicao = inputNome.value;
    const docenteEmail = localStorage.getItem('docenteEmail');

    if (!nomeInstituicao) {
        alert("Por favor, preencha o nome da instituição.");
        return;
    }

    if (!docenteEmail) {
        alert("Não foi possível obter o e-mail do docente. Por favor, faça login novamente.");
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/instituicoes/cadastro", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ nome: nomeInstituicao, docenteEmail: docenteEmail })
        });

        if (!response.ok) {
            console.error(`Erro na requisição: ${response.status} - ${response.statusText}`);
            return;
        }

        const resposta = await response.json();

        if (resposta.success) {
            alert("Instituição cadastrada com sucesso!");
            window.location.href = "instituicao.html";
        } else {
            alert("Erro ao cadastrar: " + resposta.message);
        }
    } catch (err) {
        alert("Ocorreu um erro inesperado: " + err.message);
        console.error("Erro no cadastro da instituição:", err);
    }
}

// Esta função é executada quando a janela é carregada.
// Ela verifica se o usuário está logado (pelo nome do docente no localStorage) e redireciona para a página de login se não estiver.
// Além disso, ela exibe o nome do docente logado na interface.
window.onload = function(){
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
};

// Função para voltar à página de instituições.
function voltarParaInstituicoes() {
    window.location.href = 'instituicao.html';
};
