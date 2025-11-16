/* Autor: Felipe Batista Bastos */

// Função principal que roda quando a página carrega
window.onload = () => {
    configurarPaginaComponente();
};

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

    // Função que cria o html do item da lista
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

window.onload = function(){
    var docenteDisplay = document.getElementById('docenteDisplay');
    if(!docenteDisplay) return; 
    var nome = localStorage.getItem('docenteName');
    if(nome){ docenteDisplay.textContent = nome; } 
    else { window.location.href = 'login.html'; }
};

function logout() {
    localStorage.removeItem('docenteName');
    localStorage.removeItem('docenteEmail');
    window.location.href = 'login.html';
};
