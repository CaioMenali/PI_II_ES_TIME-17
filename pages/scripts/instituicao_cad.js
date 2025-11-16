/* Autor: Felipe Cesar Ferreira Lirani */

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
        const response = await fetch("http://localhost:3000/instituicoes", {
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
