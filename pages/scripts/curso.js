/* Autores: Felipe Batista Bastos */

document.addEventListener("DOMContentLoaded", async () => {
    carregarInstituicoes();
});

async function carregarInstituicoes() {
    const select = document.getElementById("select-instituicao");

    const r = await fetch("http://localhost:3000/instituicoes/listar");
    const lista = await r.json();

    lista.forEach(i => {
        const op = document.createElement("option");
        op.value = i[0];
        op.textContent = i[1];
        select.appendChild(op);
    });

    select.addEventListener("change", carregarCursos);

    // carrega de imediato
    carregarCursos();
}

async function carregarCursos() {
    const select = document.getElementById("select-instituicao");
    const idInst = select.value;

    const listaContainer = document.getElementById("lista-cursos");
    const msgVazia = document.getElementById("msg-lista-vazia-cursos");

    const r = await fetch(`http://localhost:3000/cursos/listar/${idInst}`);
    const lista = await r.json();

    listaContainer.innerHTML = "";
    
    if (!lista || lista.length === 0) {
    msgVazia.style.display = "block";
    return;
}

    msgVazia.style.display = "none";

    lista.forEach(c => {
        adicionarCursoNaLista(c[0], c[1]);
    });
}

function adicionarCursoNaLista(id, nome) {
    const listaContainer = document.getElementById("lista-cursos");

    const divItem = document.createElement("div");
    divItem.className = "list-item";

    const strongNome = document.createElement("strong");
    strongNome.textContent = nome;

    const link = document.createElement("a");
    link.href = "#";
    link.textContent = "Ver Disciplinas";

    divItem.appendChild(strongNome);
    divItem.appendChild(link);

    listaContainer.appendChild(divItem);
}

/* ------- LOGIN / LOGOUT ------- */

document.addEventListener("DOMContentLoaded", function(){
  var el = document.getElementById('docenteDisplay');
  if(!el) return; 
  var n = localStorage.getItem('docenteName');
  if(n){ el.textContent = n; } 
  else { window.location.href = 'login.html'; }
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