/* Autores: Felipe Batista Bastos, Felipe Cesar Ferreira Lirani */

window.onload = () => {
    carregarDisciplinas();
};

async function carregarDisciplinas() {
    const lista = document.getElementById("lista-disciplinas");
    const msgVazia = document.getElementById("msg-lista-vazia-disciplinas");

    const r = await fetch("http://localhost:3000/disciplinas/listar");
    const disciplinas = await r.json();

    lista.innerHTML = "";

    if (disciplinas.length === 0) {
        msgVazia.style.display = "block";
        return;
    }

    msgVazia.style.display = "none";

    disciplinas.forEach(d => {
        adicionarDisciplinaNaLista(d[0], d[1], d[2], d[3], d[4]);
    });
}

function adicionarDisciplinaNaLista(id, nome, sigla, codigo, periodo) {
    const lista = document.getElementById("lista-disciplinas");

    const divItem = document.createElement("div");
    divItem.className = "list-item";

    const strongNome = document.createElement("strong");
    strongNome.textContent = `${nome} (${codigo})`;

    const link = document.createElement("a");
    link.href = "#";
    link.textContent = "Ver Turmas";

    divItem.appendChild(strongNome);
    divItem.appendChild(link);
    lista.appendChild(divItem);
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
