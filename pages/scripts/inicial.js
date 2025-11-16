// Autores: Felipe Cesar Ferreira Lirani

// Função para verificar existencia de cadasto de intituicao e curso
window.onload = async function() {
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

// Função para fechar painel alerta institucao e curso
function fecharPainelAlerta() {
    const painelAlerta = document.getElementById("painelAlerta");
    painelAlerta.classList.add("hidden");
};

// Chamadas do onclick do botão
function abrirInstituicao() {
    window.location.href = "instituicao.html";
};

async function abrirDisciplinas() {
    const autorizado = await verificarInstituicaoECurso();
    if (autorizado) {
        window.location.href = "disciplina.html";
    } else {
        document.getElementById("painelAlerta").classList.remove("hidden");
    };
};

async function abrirTurmas() {
    const autorizado = await verificarInstituicaoECurso();
    if (autorizado) {
        window.location.href = "turma.html";
    } else {
        document.getElementById("painelAlerta").classList.remove("hidden");
    };
};  

// Verificação no backend (verificar existencia de cadasto de intituicao e curso)
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

window.onload = function(){
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
};
