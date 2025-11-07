// Autores: Felipe Cesar Ferreira Lirani
// inicial.js

document.addEventListener("DOMContentLoaded", () => {
    const fecharPainel = document.getElementById("fecharPainel");
    fecharPainel.addEventListener("click", () => {
        document.getElementById("painelAlerta").classList.add("hidden");
    });
});

// Ações chamadas pelo onclick dos botões
function abrirInstituicao() {
    window.location.href = "../../T_instituicao/html/";
}

async function abrirDisciplinas() {
    const autorizado = await verificarInstituicaoECurso();
    if (autorizado) {
        window.location.href = "../../T_disciplina/html/disciplina.html";
    } else {
        document.getElementById("painelAlerta").classList.remove("hidden");
    }
}

async function abrirTurmas() {
    const autorizado = await verificarInstituicaoECurso();
    if (autorizado) {
        window.location.href = "../../T_turma/html/";
    } else {
        document.getElementById("painelAlerta").classList.remove("hidden");
    }
}

// Simulação da verificação no backend (aqui será substituído futuramente)
async function verificarInstituicaoECurso() {
    try {
        // Exemplo real futuro:
        // const resp = await fetch('/api/verificarInstituicaoCurso');
        // const data = await resp.json();
        // return data.temInstituicao && data.temCurso;

        // Por enquanto, simulação:
        const temInstituicao = false;
        const temCurso = false;
        return temInstituicao && temCurso;
    } catch (erro) {
        console.error("Erro ao verificar instituição e curso:", erro);
        return false;
    }
}
