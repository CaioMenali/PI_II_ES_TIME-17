/* Autores: Felipe Batista Bastos */

// Este arquivo contém as funções JavaScript para o cadastro de cursos.
// Ele lida com a interação do usuário na página de cadastro de cursos, incluindo o carregamento de instituições e o envio de dados para o backend.

// Esta função é executada quando a janela é carregada.
// Ela carrega a lista de instituições do backend e as preenche em um elemento select.
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

// Função assíncrona para salvar um novo curso.
// Captura o nome do curso e o ID da instituição selecionada, e os envia para o endpoint /cursos do backend.
// Em caso de sucesso, exibe uma mensagem e redireciona para a página de cursos.
// Parâmetros:
//   - event: O evento de submissão do formulário (opcional).
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

// Esta função é executada quando a janela é carregada.
// Ela verifica se o usuário está logado (pelo nome do docente no localStorage) e redireciona para a página de login se não estiver.
// Além disso, ela exibe o nome do docente logado na interface.
window.onload = function(){
    var docenteDisplay = document.getElementById('docenteDisplay');
    if(!docenteDisplay) return; 
    var nome = localStorage.getItem('docenteName');
    if(nome){ docenteDisplay.textContent = nome; } 
    else { window.location.href = 'login.html'; }
};

// Função para realizar o logout do docente.
// Remove as informações de login (nome e e-mail) do localStorage e redireciona o usuário para a página de login.
function logout() {
    localStorage.removeItem('docenteName');
    localStorage.removeItem('docenteEmail');
    window.location.href = 'login.html';
};
