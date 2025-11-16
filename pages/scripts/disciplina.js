/* Autores: Felipe Batista Bastos */

// Este arquivo contém as funções JavaScript para a listagem de disciplinas.
// Ele é responsável por carregar e exibir a lista de disciplinas cadastradas na interface do usuário.

// Função assíncrona para carregar e exibir a lista de disciplinas.
// Faz uma requisição ao endpoint /disciplinas/listar do backend e preenche a lista na interface.
// Se não houver disciplinas, exibe uma mensagem de lista vazia.
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

// Função para adicionar visualmente uma disciplina à lista exibida na página.
// Cria elementos HTML para representar a disciplina e os anexa ao container da lista.
// Parâmetros:
//   - id: O ID da disciplina.
//   - nome: O nome da disciplina.
//   - sigla: A sigla da disciplina.
//   - codigo: O código da disciplina.
//   - periodo: O período da disciplina.
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

// Esta função é executada quando a janela é carregada.
// Ela verifica se o usuário está logado (pelo nome do docente no localStorage) e redireciona para a página de login se não estiver.
// Além disso, ela exibe o nome do docente logado na interface.
window.onload = function(){
    var docenteDisplay = document.getElementById('docenteDisplay');
    if(!docenteDisplay) return; 
    var nome = localStorage.getItem('docenteName');
    if(nome){ docenteDisplay.textContent = nome; } 
    else { window.location.href = 'login.html'; }

    // Esta função inicia o processo de carregamento das disciplinas.
    carregarDisciplinas();
};

// Função para realizar o logout do docente.
// Remove as informações de login (nome e e-mail) do localStorage e redireciona o usuário para a página de login.
function logout() {
    localStorage.removeItem('docenteName');
    localStorage.removeItem('docenteEmail');
    window.location.href = 'login.html';
};
