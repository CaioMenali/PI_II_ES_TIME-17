/* Autores: Felipe Batista Bastos */

// Este arquivo contém as funções JavaScript para o cadastro de disciplinas.
// Ele lida com a interação do usuário na página de cadastro de disciplinas, enviando os dados para o backend e atualizando a interface.

// Função assíncrona para salvar uma nova disciplina.
// Captura os valores dos campos de nome, sigla, código e período, valida-os e os envia para o endpoint /disciplinas do backend.
// Em caso de sucesso, exibe uma mensagem e limpa os campos do formulário.
async function salvarDisciplina() {
    const inputNome = document.getElementById("nome_disciplina");
    const inputSigla = document.getElementById("sigla_disciplina");
    const inputCodigo = document.getElementById("codigo_disciplina");
    const inputPeriodo = document.getElementById("periodo_disciplina");

    const dados = {
        nome: inputNome.value.trim(),
        sigla: inputSigla.value.trim(),
        codigo: inputCodigo.value.trim(),
        periodo: inputPeriodo.value.trim()
    };

    if (!dados.nome || !dados.sigla || !dados.codigo) {
        alert("Preencha Nome, Sigla e Código.");
        return;
    }

    try {
        const r = await fetch("http://localhost:3000/disciplinas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (!r.ok) {
            throw new Error("Requisição falhou com status: " + r.status);
        }

        const resposta = await r.json();

        if (resposta.success) {
            alert("Disciplina cadastrada com sucesso!");
            inputNome.value = "";
            inputSigla.value = "";
            inputCodigo.value = "";
            inputPeriodo.value = "";
        } else {
            alert("Erro ao cadastrar: " + resposta.message);
        }
    } catch (erro) {
        alert("Ocorreu um erro inesperado ao cadastrar a disciplina: " + erro.message);
        console.error("Erro ao cadastrar disciplina:", erro);
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
