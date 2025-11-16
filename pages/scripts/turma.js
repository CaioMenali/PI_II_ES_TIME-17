/* Autor: Felipe Batista Bastos */

window.onload = () => {
    carregarTurmas();
};

async function carregarTurmas() {
    const listaContainer = document.getElementById("lista-turmas");
    const msgVazia = document.getElementById("msg-lista-vazia-turmas");

    const r = await fetch("http://localhost:3000/turmas/listar");
    const lista = await r.json();

    listaContainer.innerHTML = "";

    if (lista.length === 0) {
        msgVazia.style.display = "block";
        return;
    }

    msgVazia.style.display = "none";

    lista.forEach(t => {
        adicionarTurmaNaLista(t[0], t[1], t[2]); 
    });
}

function adicionarTurmaNaLista(id, nome, codigo) {
    const listaContainer = document.getElementById("lista-turmas");

    const divItem = document.createElement("div");
    divItem.className = "list-item";

    const strongNome = document.createElement("strong");
    strongNome.textContent = `${nome} (${codigo})`;

    const linkVer = document.createElement("a");
    linkVer.href = "#";
    linkVer.textContent = "Ver Alunos";

    divItem.appendChild(strongNome);
    divItem.appendChild(linkVer);

    listaContainer.appendChild(divItem);
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
