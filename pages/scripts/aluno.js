/* Autor: Gabriel Batista Bastos*/

// Este arquivo contém as funções JavaScript para a listagem de alunos.
// Ele é responsável por carregar e exibir a lista de alunos cadastrados na interface do usuário.

// Quando carregar a página, listar alunos
window.onload = async () => {

    const listaContainer = document.getElementById("lista-alunos");
    const msgVazia = document.getElementById("msg-lista-vazia-alunos");

    // Buscar lista no backend
    const r = await fetch("http://localhost:3000/alunos/listar");
    const lista = await r.json();

    listaContainer.innerHTML = "";

    if (!lista || lista.length === 0) {
        msgVazia.style.display = "block";
        return;
    }

    msgVazia.style.display = "none";

    lista.forEach(a => {
        adicionarAlunoNaLista(listaContainer, a[2], a[1]);
    });
};


// Função para adicionar visualmente um aluno à lista exibida na página.
// Cria elementos HTML para representar o aluno e os anexa ao container da lista.
// Parâmetros:
//   - container: O elemento HTML onde o aluno será adicionado.
//   - nome: O nome do aluno.
//   - RA: O Registro Acadêmico do aluno.
function adicionarAlunoNaLista(container, nome, RA) {

    const divItem = document.createElement("div");
    divItem.className = "list-item";

    const strongNome = document.createElement("strong");
    strongNome.textContent = `${nome} (RA: ${RA})`;

    const linkNotas = document.createElement("a");
    linkNotas.href = "#";
    linkNotas.textContent = "Ver Notas";

    divItem.appendChild(strongNome);
    divItem.appendChild(linkNotas);

    container.appendChild(divItem);
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
