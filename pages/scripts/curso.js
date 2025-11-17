/* Autores: Felipe Batista Bastos */

// Este arquivo contém as funções JavaScript para a listagem de cursos.
// Ele é responsável por carregar e exibir a lista de cursos cadastrados, filtrados por instituição, na interface do usuário.

// Função assíncrona para carregar e exibir a lista de instituições.
// Faz uma requisição ao endpoint /instituicoes/listar do backend e preenche um elemento select com as instituições.
// Também configura um evento de mudança para o select, que recarrega os cursos quando uma nova instituição é selecionada.
async function carregarInstituicoes() {
    const select = document.getElementById("select-instituicao");
    select.innerHTML = ""; // Limpa as opções existentes

    const docenteEmail = localStorage.getItem('docenteEmail');
    if (!docenteEmail) {
        console.error("docenteEmail não encontrado no localStorage. Redirecionando para a página de login.");
        window.location.href = 'login.html';
        return;
    }

    try {
        const r = await fetch(`http://localhost:3000/instituicoes/listar?docenteEmail=${encodeURIComponent(docenteEmail)}`);
        if (!r.ok) {
            throw new Error(`Erro ao carregar instituições: ${r.statusText}`);
        }
        const lista = await r.json();

        if (lista.length === 0) {
            const op = document.createElement("option");
            op.value = "";
            op.textContent = "Nenhuma instituição encontrada para este docente.";
            select.appendChild(op);
            select.disabled = true; // Desabilita o select se não houver opções
        } else {
            lista.forEach(i => {
                const op = document.createElement("option");
                op.value = i[0];
                op.textContent = i[1];
                select.appendChild(op);
            });
            select.disabled = false;
        }

        select.addEventListener("change", carregarCursos);
        carregarCursos(); // Carrega os cursos da primeira instituição ou exibe mensagem de vazio
    } catch (error) {
        console.error("Erro ao carregar instituições:", error);
        const op = document.createElement("option");
        op.value = "";
        op.textContent = "Erro ao carregar instituições.";
        select.appendChild(op);
        select.disabled = true;
    }
}

// Função assíncrona para carregar e exibir a lista de cursos com base na instituição selecionada.
// Faz uma requisição ao endpoint /cursos/listar/:idInst do backend e preenche a lista de cursos na interface.
// Se não houver cursos para a instituição, exibe uma mensagem de lista vazia.
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

// Função para adicionar visualmente um curso à lista exibida na página.
// Cria elementos HTML para representar o curso e os anexa ao container da lista.
// Parâmetros:
//   - id: O ID do curso.
//   - nome: O nome do curso.
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

// Esta função é executada quando a janela é carregada.
// Ela verifica se o usuário está logado (pelo nome do docente no localStorage) e redireciona para a página de login se não estiver.
// Além disso, ela exibe o nome do docente logado na interface.
window.onload = function(){
    var docenteDisplay = document.getElementById('docenteDisplay');
    if(!docenteDisplay) return; 
    var nome = localStorage.getItem('docenteName');
    if(nome){ docenteDisplay.textContent = nome; } 
    else { window.location.href = 'login.html'; }

    // Esta função inicia o processo de carregamento das instituições e, consequentemente, dos cursos.
    carregarCursos();
};

// Função para realizar o logout do docente.
// Remove as informações de login (nome e e-mail) do localStorage e redireciona o usuário para a página de login.
function logout() {
    localStorage.removeItem('docenteName');
    localStorage.removeItem('docenteEmail');
    window.location.href = 'login.html';
};
