/* Autores: Felipe Cesar Ferreira Lirani */

// Este arquivo contém funções JavaScript para a página inicial da aplicação.
// Ele é responsável por verificar a existência de cadastro de instituição e curso, exibir alertas e gerenciar a navegação.

// Função para verificar existencia de cadasto de intituicao e curso

// Função para fechar o painel de alerta de instituição e curso.
// Remove a classe 'hidden' do painel, tornando-o invisível.
function fecharPainelAlerta() {
    const painelAlerta = document.getElementById("painelAlerta");
    painelAlerta.classList.add("hidden");
};

// Função para redirecionar o usuário para a página de cadastro de instituição.
function abrirInstituicao() {
    window.location.href = "instituicao.html";
};

// Função assíncrona para abrir a página de disciplinas.
// Primeiro, verifica se a instituição e o curso estão cadastrados. Se sim, redireciona para a página de disciplinas; caso contrário, exibe um alerta.
async function abrirDisciplinas() {
    const autorizado = await verificarInstituicaoECurso();
    if (autorizado) {
        window.location.href = "disciplina.html";
    } else {
        document.getElementById("painelAlerta").classList.remove("hidden");
    };
};

// Função assíncrona para abrir a página de turmas.
// Primeiro, verifica se a instituição e o curso estão cadastrados. Se sim, redireciona para a página de turmas; caso contrário, exibe um alerta.
async function abrirTurmas() {  const autorizado = await verificarInstituicaoECurso();
    if (autorizado) {
        window.location.href = "turma.html";
    } else {
        document.getElementById("painelAlerta").classList.remove("hidden");
    };
};  

// Função assíncrona para verificar a existência de cadastro de instituição e curso no backend.
// Atualmente, simula a existência de ambos para fins de desenvolvimento.
// Retorna true se ambos existirem, false caso contrário.
async function verificarInstituicaoECurso() {
    try {
        // Substituir depois do backend estar funcionando
        // const resp = await fetch('/api/verificarInstituicaoCurso');
        // const data = await resp.json();
        // return data.temInstituicao && data.temCurso;

        // Por enquanto, simulação:
        const temInstituicao = true;
        const temCurso = true;
        return temInstituicao && temCurso;
    } catch (erro) {
        console.error("Erro ao verificar instituição e curso:", erro);
        return false;
    };
};

// Esta função é executada quando a janela é carregada.
// Ela verifica se o usuário está logado (pelo nome do docente no localStorage) e redireciona para a página de login se não estiver.
// Além disso, ela exibe o nome do docente logado na interface.
window.onload = async function(){
    var docenteDisplay = document.getElementById('docenteDisplay');
    if(!docenteDisplay) return; 
    var nome = localStorage.getItem('docenteName');
    if(nome){ docenteDisplay.textContent = nome; } 
    else { window.location.href = 'login.html'; }
    
    const autorizado = await verificarInstituicaoECurso();

    if (autorizado) {
        console.log ("Autorizado");
        return;
    } else {
        const painelAlerta = this.document.getElementById("painelAlerta");
        document.getElementById("painelAlerta");
        painelAlerta.classList.remove("hidden");
    };
};

// Função para realizar o logout do docente.
// Remove as informações de login (nome e e-mail) do localStorage e redireciona o usuário para a página de login.
function logout() {
    localStorage.removeItem('docenteName');
    localStorage.removeItem('docenteEmail');
    window.location.href = 'login.html';
};
