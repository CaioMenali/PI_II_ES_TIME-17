/* Autores: Felipe Batista Bastos, Felipe Cesar Ferreira Lirani */

const inputNome = document.getElementById("nome_disciplina");
const inputSigla = document.getElementById("sigla_disciplina");
const inputCodigo = document.getElementById("codigo_disciplina");
const inputPeriodo = document.getElementById("periodo_disciplina");
const listaContainer = document.getElementById("lista-disciplinas");
const msgVazia = document.getElementById("msg-lista-vazia-disciplinas");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const dados = {
        nome: inputNome.value.trim(),
        sigla: inputSigla.value.trim(),
        codigo: inputCodigo.value.trim(),
        periodo: inputPeriodo.value.trim()
    };

    if (dados.nome === "" || dados.codigo === "" || dados.sigla === "") {
            alert("Por favor, preencha pelo menos Nome, Sigla e Código.");
            return;
    }

    adicionarDisciplinaNaLista(dados);

    // Limpa os campos
    inputNome.value = "";
    inputSigla.value = "";
    inputCodigo.value = "";
    inputPeriodo.value = "";
});

// Função auxiliar (helper) que cria o HTML do item da lista
function adicionarDisciplinaNaLista(dados) {
    if (msgVazia) msgVazia.style.display = "none";
    
    const divItem = document.createElement("div");
    divItem.className = "list-item";
    
    const strongNome = document.createElement("strong");
    // Combina o nome e o código para exibição
    strongNome.textContent = `${dados.nome} (${dados.codigo})`; 

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
