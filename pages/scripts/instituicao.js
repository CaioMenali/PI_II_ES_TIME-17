/* Autores: Felipe Batista Bastos , Felipe Cesar Ferreira Lirani */

window.onload = async () => {
    carregarInstituicoes();
};

/* ================================
   LISTAGEM DE INSTITUIÇÕES
================================ */

async function carregarInstituicoes() {
    const container = document.getElementById("lista-instituicoes");
    const msgVazia = document.getElementById("msg-lista-vazia");

    const r = await fetch("http://localhost:3000/instituicoes/listar");
    const lista = await r.json();

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

/* ================================
   LOGIN / LOGOUT
================================ */

window.onload = () => {
    const el = document.getElementById('docenteDisplay');
    if (!el) return;
    const nome = localStorage.getItem('docenteName');

    if (nome) el.textContent = nome;
    else window.location.href = 'login.html';
};

window.onload = () => {
    const b = document.getElementById('logoutBtn');
    if (!b) return;

    b.addEventListener('click', () => {
        localStorage.removeItem('docenteName');
        localStorage.removeItem('docenteEmail');
        window.location.href = 'login.html';
    });
};
