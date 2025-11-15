/* Autores: Felipe Batista Bastos , Felipe Cesar Ferreira Lirani*/

document.addEventListener("DOMContentLoaded", async () => {

    const listaContainer = document.getElementById("lista-instituicoes");
    const msgVazia = document.getElementById("msg-lista-vazia");

    const r = await fetch("http://localhost:3000/instituicoes/listar");
    const lista = await r.json();

    listaContainer.innerHTML = ""; // limpa antes de preencher

    if (!lista || lista.length === 0) {
        msgVazia.style.display = "block";
        return;
    }

    msgVazia.style.display = "none";

    lista.forEach(inst => {

        const divItem = document.createElement("div");
        divItem.className = "list-item";

        const strongNome = document.createElement("strong");
        strongNome.textContent = inst[1]; // nome da instituição

        const linkCursos = document.createElement("a");
        linkCursos.href = "#";
        linkCursos.textContent = "Ver Cursos";

        divItem.appendChild(strongNome);
        divItem.appendChild(linkCursos);

        listaContainer.appendChild(divItem);
    });
});

document.addEventListener("DOMContentLoaded", function(){
  var el = document.getElementById('docenteDisplay');
  if(!el) return; var n = localStorage.getItem('docenteName');
  if(n){ el.textContent = n; } else { window.location.href = 'login.html'; }
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