/* Autores: Felipe Batista Bastos, Felipe Cesar Ferreira Lirani */

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
