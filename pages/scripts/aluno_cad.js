/* Autores: Felipe Batista Bastos, Felipe Cesar Ferreira Lirani */

const inputNome = document.getElementById("nome_aluno");
const inputRA = document.getElementById("sigla_aluno");
const listaContainer = document.getElementById("lista-aluno");
const msgVazia = document.getElementById("msg-lista-vazia-aluno");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const dados = {
        nome: inputNome.value.trim(),
        RA: inputRA.value.trim(),
    };

    if (dados.nome === "" || dados.RA === "") {
            alert("Por favor, preencha pelo menos Nome, Sigla e Código.");
            return;
    }

    adicionarAlunoNaLista(dados);

    // Limpa os campos
    inputNome.value = "";
    inputRA.value = "";
});

// Função auxiliar (helper) que cria o HTML do item da lista
function adicionarAlunoNaLista(dados) {
    if (msgVazia) msgVazia.style.display = "none";
    
    const divItem = document.createElement("div");
    divItem.className = "list-item";
    
    const strongNome = document.createElement("strong");
    // Combina o nome e o código para exibição
    strongNome.textContent = `${dados.nome} (${dados.RA})`; 

    const linkTurmas = document.createElement("a");
    linkTurmas.href = "#"; // Placeholder
    linkTurmas.textContent = "Ver Turmas";
    
    divItem.appendChild(strongNome);
    divItem.appendChild(linkTurmas);
    
    listaContainer.appendChild(divItem);
}

document.addEventListener("DOMContentLoaded", function(){
  var el = document.getElementById('docenteDisplay');
  if(!el) return; var n = localStorage.getItem('docenteName');
  if(n){ el.textContent = n; } else { el.innerHTML = '<a href="login.html">Login</a>'; }
});