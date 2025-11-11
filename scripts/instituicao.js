// Função para receber e adicionar as instituicoes e cursos em uma lista 
window.onload = async function adicionarItem() {
  
    const container = document.getElementById('container');

    const novoParagrafo = document.createElement('p');

    novoParagrafo.textContent = 'Este é um item novo!';
  
    novoParagrafo.classList.add('item-lista');

    container.appendChild(novoParagrafo);
}