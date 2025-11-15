/* Autores: Felipe Batista Bastos, Felipe Cesar Ferreira Lirani */

document.addEventListener("DOMContentLoaded", () => {
    carregarDisciplinas();
});

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

/* LOGIN E LOGOUT */
document.addEventListener("DOMContentLoaded", function () {
    var el = document.getElementById('docenteDisplay');
    if (!el) return; var n = localStorage.getItem('docenteName');
    if (n) { el.textContent = n; } else { window.location.href = 'login.html'; }
});

document.addEventListener("DOMContentLoaded", function () {
    var b = document.getElementById('logoutBtn');
    if (!b) return;
    b.addEventListener('click', function () {
        localStorage.removeItem('docenteName');
        localStorage.removeItem('docenteEmail');
        window.location.href = 'login.html';
    });
});