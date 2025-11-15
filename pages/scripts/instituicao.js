//Autores: Felipe Cesar Ferreira Lirani

// Função para receber e adicionar as instituicoes e cursos em uma lista 
window.onload = async function adicionarItem() {
  
    const container = document.getElementById('container');

    const novoParagrafo = document.createElement('p');

    novoParagrafo.textContent = 'Este é um item novo!';
  
    novoParagrafo.classList.add('item-lista');

    container.appendChild(novoParagrafo);
}
document.addEventListener("DOMContentLoaded", function(){
  var el = document.getElementById('docenteDisplay');
  if(!el) return; var n = localStorage.getItem('docenteName');
  if(n){ el.textContent = n; } else { el.innerHTML = '<a href="login.html">Login</a>'; }
});