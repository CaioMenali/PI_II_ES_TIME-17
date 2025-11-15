// Autores: Felipe Cesar Ferreira Lirani
// index

// Função para verificar existencia de cadasto de intituicao e curso
document.addEventListener("DOMContentLoaded", async function() {
    const autorizado = await verificarInstituicaoECurso();

    if (autorizado) {
        console.log ("Autorizado");
        return;
    } else {
        const painelAlerta = this.document.getElementById("painelAlerta");
        document.getElementById("painelAlerta");
        painelAlerta.classList.remove("hidden");
    }
})

// Função para fechar painel alerta institucao e curso
function fecharPainelAlerta() {
    const painelAlerta = document.getElementById("painelAlerta");
    painelAlerta.classList.add("hidden");
}

// Chamadas do onclick do botão
function abrirInstituicao() {
    window.location.href = "instituicao.html";
}

async function abrirDisciplinas() {
    const autorizado = await verificarInstituicaoECurso();
    if (autorizado) {
        window.location.href = "disciplina.html";
    } else {
        document.getElementById("painelAlerta").classList.remove("hidden");
    }
}

async function abrirTurmas() {
    const autorizado = await verificarInstituicaoECurso();
    if (autorizado) {
        window.location.href = "turma.html";
    } else {
        document.getElementById("painelAlerta").classList.remove("hidden");
    }
}

// Verificação no backend (verificar existencia de cadasto de intituicao e curso)
async function verificarInstituicaoECurso() {
    try {
        // Substituir depois do backend estar funcional:
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
    }
}

document.addEventListener("DOMContentLoaded", function(){
  var el = document.getElementById('docenteDisplay');
  if(!el) return; var n = localStorage.getItem('docenteName');
  if(n){ el.textContent = n; } else { window.location.href = 'login.html'; }
});
document.addEventListener("DOMContentLoaded", function(){
  var b = document.getElementById('logoutBtn');
  if(!b) return;
  b.addEventListener('click', function(){
    localStorage.removeItem('docenteName');
    localStorage.removeItem('docenteEmail');
    window.location.href = 'login.html';
  });
});
