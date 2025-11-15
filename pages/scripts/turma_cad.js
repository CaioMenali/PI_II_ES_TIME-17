/* Autores: Felipe Batista Bastos */

// Função principal que roda quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
    
    // Tenta encontrar o form de turma e configurar a página
    CadastroTurma();
    
});

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


/**
 * Procura e configura os elementos da página de TURMA
 */
function CadastroTurma() {
    const form = document.getElementById("form-cad-turma");
    if (!form) return;

    const inputNome = document.getElementById("nome_turma");
    const inputCodigo = document.getElementById("codigo_turma");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const dados = {
            nome: inputNome.value.trim(),
            codigo: inputCodigo.value.trim()
        };

        if (!dados.nome || !dados.codigo) {
            alert("Por favor, preencha o Nome e o Código da turma.");
            return;
        }

            // Envia ao backend
        const r = await fetch("http://localhost:3000/turmas", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(dados)
        });

        const resposta = await r.json();

        if (resposta.success) {
            alert("Turma cadastrada com sucesso!");
            inputNome.value = "";
            inputCodigo.value = "";
        } else {
            alert("Erro ao salvar turma: " + resposta.message);
        }
    });
    }