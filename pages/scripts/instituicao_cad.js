/* Autor: Felipe Cesar Ferreira Lirani */

async function cadastrarInstituicao() {
    const form = document.getElementById("form-cad-instituicao");
    const inputNome = document.getElementById("nome");

    const nomeInstituicao = inputNome.value.trim();

    if (!nomeInstituicao) {
        alert("Por favor, preencha o nome da instituição.");
        return;
    }

    try {
        const docenteEmail = localStorage.getItem('docenteEmail');

        const response = await fetch("http://localhost:3000/instituicoes", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ nome: nomeInstituicao, docenteEmail: docenteEmail })
        });

        if (!response.ok) {
            throw new Error("Requisição falhou com status: " + response.status);
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
