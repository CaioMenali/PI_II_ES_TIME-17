/* Autores: Felipe Batista Bastos */

window.onload = async () => {

    const selectInst = document.getElementById("instituicao_select");

    const r = await fetch("http://localhost:3000/instituicoes/listar");
    const lista = await r.json();

    lista.forEach(i => {
        const op = document.createElement("option");
        op.value = i[0];
        op.textContent = i[1];
        selectInst.appendChild(op);
    });
};

async function salvarCurso(event){
    if(event) event.preventDefault();
    const selectInst = document.getElementById("instituicao_select");
    const nome = document.getElementById("nome_curso").value;
    const idInst = selectInst.value;

    const r = await fetch("http://localhost:3000/cursos", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            nome,
            fk_instituicao: idInst
        })
    });

    const resposta = await r.json();

    if (resposta.success) {
        alert("Curso cadastrado com sucesso!");
        window.location.href = "curso.html";
    } else {
        alert("Erro: " + resposta.message);
    }
}

window.onload = function(){
    var docenteDisplay = document.getElementById('docenteDisplay');
    if(!docenteDisplay) return; 
    var nome = localStorage.getItem('docenteName');
    if(nome){ docenteDisplay.textContent = nome; } 
    else { window.location.href = 'login.html'; }
};

function logout() {
    localStorage.removeItem('docenteName');
    localStorage.removeItem('docenteEmail');
    window.location.href = 'login.html';
};
