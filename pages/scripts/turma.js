/* Autor: Felipe Batista Bastos */

// Este arquivo contém as funções JavaScript para a listagem de turmas.
// Ele é responsável por carregar e exibir a lista de turmas cadastradas na interface do usuário.

// Esta função é executada quando a janela é carregada.
// Ela inicia o processo de carregamento das turmas.
window.onload = () => {
    carregarTurmas();
};

// Função assíncrona para carregar e exibir a lista de turmas.
// Faz uma requisição ao endpoint /turmas/listar do backend e preenche a lista na interface.
// Se não houver turmas, exibe uma mensagem de lista vazia.
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

// Função para adicionar visualmente uma turma à lista exibida na página.
// Cria elementos HTML para representar a turma e os anexa ao container da lista.
// Parâmetros:
//   - id: O ID da turma.
//   - nome: O nome da turma.
//   - codigo: O código da turma.
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

// Esta função é executada quando a janela é carregada.
// Ela verifica se o usuário está logado (pelo nome do docente no localStorage) e redireciona para a página de login se não estiver.
// Além disso, ela exibe o nome do docente logado na interface.
window.onload = function(){
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
