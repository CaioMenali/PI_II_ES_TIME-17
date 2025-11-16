// Autor: Felipe Cesar Ferreira Lirani

// Este arquivo contém as funções JavaScript para o registro de novos docentes.
// Ele lida com a captura dos dados do formulário de registro, validação e envio para o endpoint de cadastro do backend.

// Função assíncrona para tentar registrar um novo docente.
// Captura os valores dos campos de nome, e-mail, senha e telefone, valida-os e os envia para o endpoint /cadastro do backend.
// Em caso de sucesso, exibe uma mensagem e redireciona para a página de login.
async function try_register() {
    // Captura os valores digitados nos campos
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const tel = document.getElementById('tel').value;

    // Validação simples — impede envio com campos vazios
    if (!name || !email || !password || !tel) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    // Cria o objeto com os dados do docente
    const dados = {
        nome: name,
        email: email,
        telefone: tel,
        senha: password
    };

    try {
        // Envia os dados para o backend na rota /cadastro
        const response = await fetch("http://localhost:3000/docentes/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    // Recebe a resposta do servidor como uma string
    const result = await response.text();

    // Mostra o resultado na tela
    alert(result);

    // Se o cadastro for bem-sucedido, vai para a página de login
    if (result.includes("sucesso")) {
    window.location.href = "login.html";
    }

    } catch (err) {
        console.error("Erro ao conectar com o servidor:", err);
        alert("Erro ao conectar com o servidor!");
    }
}