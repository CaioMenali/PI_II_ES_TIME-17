/* Autores: Felipe Cesar Ferreira Lirani */

document.addEventListener("DOMContentLoaded", function(){
  var el = document.getElementById('docenteDisplay');
  if(!el) return; var n = localStorage.getItem('docenteName');
  if(n){ el.textContent = n; } else { window.location.href = 'login.html'; }
});

document.addEventListener("DOMContentLoaded", function(){
  var b = document.getElementById('logoutBtn');
  if(!b) return;
  b.addEventListener('click', function(){
    localStorage.removeItem('docenteName');
    localStorage.removeItem('docenteEmail');
    window.location.href = 'login.html';
  });
});