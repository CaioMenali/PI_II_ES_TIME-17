/* Autor: Felipe Cesar Ferreira Lirani */

async function carregarInstituicoes() {
    const container = document.getElementById("lista-instituicoes");
    const msgVazia = document.getElementById("msg-lista-vazia");

    const docenteEmail = localStorage.getItem('docenteEmail');
    const response = await fetch(`http://localhost:3000/instituicoes/listar?docenteEmail=${docenteEmail}`);
    const lista = await response.json();

    container.innerHTML = "";

    if (lista.length === 0) {
        msgVazia.style.display = "block";
        return;
    }

    msgVazia.style.display = "none";

    lista.forEach(i => {
        adicionarInstituicao(i[0], i[1]);
    });
}

function adicionarInstituicao(id, nome) {
    const container = document.getElementById("lista-instituicoes");

    const divItem = document.createElement("div");
    divItem.className = "list-item";

    const strongNome = document.createElement("strong");
    strongNome.textContent = nome;

    const link = document.createElement("a");
    link.href = "curso.html";
    link.textContent = "Ver Cursos";

    divItem.appendChild(strongNome);
    divItem.appendChild(link);

    container.appendChild(divItem);
}

window.onload = function(){
    carregarInstituicoes();
    
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
