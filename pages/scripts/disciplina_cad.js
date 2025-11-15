/* Autores: Felipe Batista Bastos, Felipe Cesar Ferreira Lirani */

document.addEventListener("DOMContentLoaded", () => {
    CadastroDisciplina();
});

function CadastroDisciplina() {
    const form = document.getElementById("form-cad-disciplina");
    if (!form) return;

    const inputNome = document.getElementById("nome_disciplina");
    const inputSigla = document.getElementById("sigla_disciplina");
    const inputCodigo = document.getElementById("codigo_disciplina");
    const inputPeriodo = document.getElementById("periodo_disciplina");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const dados = {
            nome: inputNome.value.trim(),
            sigla: inputSigla.value.trim(),
            codigo: inputCodigo.value.trim(),
            periodo: inputPeriodo.value.trim()
        };

        if (!dados.nome || !dados.sigla || !dados.codigo) {
            alert("Preencha Nome, Sigla e Código.");
            return;
        }

        const r = await fetch("http://localhost:3000/disciplinas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        const resposta = await r.json();

        if (resposta.success) {
            alert("Disciplina cadastrada com sucesso!");
            inputNome.value = "";
            inputSigla.value = "";
            inputCodigo.value = "";
            inputPeriodo.value = "";
        } else {
            alert("Erro ao cadastrar: " + resposta.message);
        }
    });
}

/* LOGIN E LOGOUT */
document.addEventListener("DOMContentLoaded", function () {
    var el = document.getElementById('docenteDisplay');
    if (!el) return; var n = localStorage.getItem('docenteName');
    if (n) { el.textContent = n; } else { window.location.href = 'login.html'; }
});

document.addEventListener("DOMContentLoaded", function () {
    var b = document.getElementById('logoutBtn');
    if (!b) return;
    b.addEventListener('click', function () {
        localStorage.removeItem('docenteName');
        localStorage.removeItem('docenteEmail');
        window.location.href = 'login.html';
    });
});