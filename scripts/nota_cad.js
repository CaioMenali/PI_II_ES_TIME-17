/* Autores:Felipe Batista Bastos, Felipe Cesar Ferreira Lirani */
// Função principal que roda quando a página carrega
document.addEventListener("DOMContentLoaded", () => {

    // Tenta encontrar o form de componente e configurar a página
    configurarPaginaComponente();
});


/**
 * Procura e configura os elementos da página de COMPONENTE DE NOTA
 */
function configurarPaginaComponente() {
    const form = document.getElementById("form-cad-componente");
    if (!form) return; // Se o form não existe, para aqui.

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

    // Função auxiliar (helper) que cria o HTML do item da lista
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