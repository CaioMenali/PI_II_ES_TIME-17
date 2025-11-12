/* Autores: Felipe Batista Bastos */

// Função principal que roda quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
    
    // Tenta encontrar o form de turma e configurar a página
    configurarPaginaTurma();
});


/**
 * Procura e configura os elementos da página de TURMA
 */
function configurarPaginaTurma() {
    const form = document.getElementById("form-cad-turma");
    if (!form) return; // Se o form não existe, para aqui.

    // Seletores da página de turma
    const inputNome = document.getElementById("nome_turma");
    const inputCodigo = document.getElementById("codigo_turma");
    const listaContainer = document.getElementById("lista-turmas");
    const msgVazia = document.getElementById("msg-lista-vazia-turmas");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const dados = {
            nome: inputNome.value.trim(),
            codigo: inputCodigo.value.trim()
        };

        if (dados.nome === "" || dados.codigo === "") {
             alert("Por favor, preencha o Nome e o Código da turma.");
             return;
        }

        adicionarTurmaNaLista(dados);

        // Limpa os campos
        inputNome.value = "";
        inputCodigo.value = "";
    });

    // Função auxiliar (helper) que cria o HTML do item da lista
    function adicionarTurmaNaLista(dados) {
        if (msgVazia) msgVazia.style.display = "none";
        
        const divItem = document.createElement("div");
        divItem.className = "list-item";
        
        const strongNome = document.createElement("strong");
        // Combina o nome e o código para exibição
        strongNome.textContent = `${dados.nome} (${dados.codigo})`; 

        const linkAlunos = document.createElement("a");
        linkAlunos.href = "#"; // Placeholder
        linkAlunos.textContent = "Ver Alunos"; // Próximo passo lógico
        
        divItem.appendChild(strongNome);
        divItem.appendChild(linkAlunos);
        
        listaContainer.appendChild(divItem);
    }
}