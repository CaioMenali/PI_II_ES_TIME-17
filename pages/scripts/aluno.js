/* Autores: Felipe Batista Bastos, Gabriel Batista Bastos*/

// Quando carregar a página, listar alunos
window.onload = async () => {

    const listaContainer = document.getElementById("lista-alunos");
    const msgVazia = document.getElementById("msg-lista-vazia-alunos");

    // Buscar lista no backend
    const r = await fetch("http://localhost:3000/alunos/listar");
    const lista = await r.json();

    listaContainer.innerHTML = ""; // limpar antes de exibir

    if (!lista || lista.length === 0) {
        msgVazia.style.display = "block";
        return;
    }

    msgVazia.style.display = "none";

    lista.forEach(a => {
        // a = [ID, RA, NOME]
        adicionarAlunoNaLista(listaContainer, a[2], a[1]);
    });
};


// Função para adicionar aluno na lista visualmente
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