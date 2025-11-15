/* Autores: Felipe Batista Bastos , Felipe Cesar Ferreira Lirani*/

 document.addEventListener("DOMContentLoaded", () => {
    
    const form = document.getElementById("form-cad-instituicao");
    const inputNome = document.getElementById("nome");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nomeInstituicao = inputNome.value.trim();

        if (!nomeInstituicao) {
            alert("Por favor, preencha o nome da instituição.");
            return;
        }

        const r = await fetch("http://localhost:3000/instituicoes", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ nome: nomeInstituicao })
        });

        const resposta = await r.json();

        if (resposta.success) {
            alert("Instituição cadastrada com sucesso!");
            window.location.href = "instituicao.html";
        } else {
            alert("Erro ao cadastrar: " + resposta.message);
        }
    });
});
