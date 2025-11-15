/* Autores: Felipe Batista Bastos , Felipe Cesar Ferreira Lirani*/

    const form = document.getElementById("form-cad-instituicao");
    const inputNome = document.getElementById("nome");
    const listaContainer = document.getElementById("lista-instituicoes");
    const msgVazia = document.getElementById("msg-lista-vazia");

            if (nomeInstituicao === "") {
                alert("Por favor, preencha o nome da instituição.");
                return; // Para a execução da função aqui
            }

            // 5. Se os dados fossem salvos com sucesso, atualizamos a interface:
            adicionarInstituicaoNaLista(nomeInstituicao);

            // 6. Limpa o campo de input para o próximo cadastro
            inputNome.value = "";
    /**
     * Função auxiliar para criar e adicionar o novo item na lista da tela
     */
    function adicionarInstituicaoNaLista(nome) {
        
        // 1. Esconde a mensagem "Nenhuma instituição cadastrada"
        if (msgVazia) {
            msgVazia.style.display = "none";
        }

        // 2. Cria os novos elementos HTML dinamicamente
        const divItem = document.createElement("div");
        // USAREMOS A CLASSE .list-item QUE VAMOS DEFINIR NO CSS
        divItem.className = "list-item"; 

        const strongNome = document.createElement("strong");
        strongNome.textContent = nome;

        const linkCursos = document.createElement("a");
        linkCursos.href = "#"; // Um link de placeholder
        linkCursos.textContent = "Ver Cursos";

        // 3. Monta o "quebra-cabeça" (aninhando os elementos)
        divItem.appendChild(strongNome);
        divItem.appendChild(linkCursos);

        // 4. Adiciona o item completo na lista
        listaContainer.appendChild(divItem);
    }

document.addEventListener("DOMContentLoaded", function(){
  var el = document.getElementById('docenteDisplay');
  if(!el) return; var n = localStorage.getItem('docenteName');
  if(n){ el.textContent = n; } else { el.innerHTML = '<a href="login.html">Login</a>'; }
});

