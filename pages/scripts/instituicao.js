/* Autor: Felipe Cesar Ferreira Lirani */

// Este arquivo contém as funções JavaScript para a listagem de instituições.
// Ele é responsável por carregar e exibir a lista de instituições associadas ao docente logado na interface do usuário.

// Função assíncrona para carregar e exibir a lista de instituições.
// Faz uma requisição ao endpoint /instituicoes/listar do backend, filtrando pelo e-mail do docente logado.
// Preenche a lista de instituições na interface e exibe uma mensagem de lista vazia se não houver instituições.
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
        adicionarInstituicao(i.ID_INSTITUICAO, i.NOME);
    });
}

// Função para adicionar visualmente uma instituição à lista exibida na página.
// Cria elementos HTML para representar a instituição e os anexa ao container da lista.
// Parâmetros:
//   - id: O ID da instituição.
//   - nome: O nome da instituição.
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

// Esta função é executada quando a janela é carregada.
// Ela inicia o carregamento das instituições e verifica se o usuário está logado (pelo nome do docente no localStorage).
// Se não estiver logado, redireciona para a página de login. Além disso, exibe o nome do docente logado na interface.
window.onload = function(){
    carregarInstituicoes();
    
    var docenteDisplay = document.getElementById('docenteDisplay');
    if(!docenteDisplay) return; 
    var nome = localStorage.getItem('docenteName');
    if(nome){ docenteDisplay.textContent = nome; } 
    else { window.location.href = 'login.html'; }
};

// Função para realizar o logout do docente.
// Remove as informações de login (nome e e-mail) do localStorage e redireciona o usuário para a página de login.
function logout() {
    localStorage.removeItem('docenteName');
    localStorage.removeItem('docenteEmail');
    window.location.href = 'login.html';
};

// Função para redirecionar o usuário para a página inicial.
function voltarParaInicio() {
    window.location.href = "index.html";
}