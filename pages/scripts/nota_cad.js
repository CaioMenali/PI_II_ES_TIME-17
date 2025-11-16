/* Autor: Felipe Batista Bastos */

// Este arquivo contém as funções JavaScript para o cadastro de componentes de nota.
// Ele lida com a interação do usuário na página de cadastro de componentes, adicionando-os visualmente à lista.

// Função para configurar a página de cadastro de componentes.
// Obtém referências aos elementos do formulário e da lista, e adiciona um event listener para o evento de submit do formulário.
function configurarPaginaComponente() {
    const form = document.getElementById("form-cad-componente");
    if (!form) return;

    // Seletores da página de componente
    const inputNome = document.getElementById("nome_componente");
    const inputNota1 = document.getElementById("nota1_componente");
    const inputNota2 = document.getElementById("nota2_componente");
    const inputNota3 = document.getElementById("nota3_componente");
    const inputDesc = document.getElementById("desc_componente");
    const listaContainer = document.getElementById("lista-componentes");
    const msgVazia = document.getElementById("msg-lista-vazia-componentes");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const dados = {
            nome: inputNome.value.trim(),
            nota1: inputNota1.value.trim(),
            nota2: inputNota2.value.trim(),
            nota3: inputNota3.value.trim(),
            descricao: inputDesc.value.trim()
        };

        if (dados.nome === "" || dados.nota1 === "" || dados.nota2 === "" || dados.nota3 === "") {
             alert("Por favor, preencha Nome e Sigla.");
             return;
        }

        adicionarComponenteNaLista(dados);

        // Limpa os campos
        inputNome.value = "";
        inputNota1.value = "";
        inputNota2.value = "";
        inputNota3.value = "";
        inputDesc.value = "";
    });

    // Função que adiciona visualmente um componente à lista exibida na página.
// Cria elementos HTML para representar o componente e os anexa ao container da lista.
// Parâmetros:
//   - dados: Objeto contendo as propriedades 'nome', 'nota1', 'nota2', 'nota3' e 'descricao' do componente.
function adicionarComponenteNaLista(dados) {
        if (msgVazia) msgVazia.style.display = "none";
        
        const divItem = document.createElement("div");
        divItem.className = "list-item";
        
        const strongNome = document.createElement("strong");
        strongNome.textContent = `${dados.nome} (${dados.sigla})`; 

        const linkEditar = document.createElement("a");
        linkEditar.href = "#"; // Placeholder
        linkEditar.textContent = "Editar";
        
        divItem.appendChild(strongNome);
        divItem.appendChild(linkEditar);
        
        listaContainer.appendChild(divItem);
    }
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

    // Configura os event listeners e inicializa a página de cadastro de componentes.
    configurarPaginaComponente();
};

// Função para realizar o logout do docente.
// Remove as informações de login (nome e e-mail) do localStorage e redireciona o usuário para a página de login.
function logout() {
    localStorage.removeItem('docenteName');
    localStorage.removeItem('docenteEmail');
    window.location.href = 'login.html';
};
