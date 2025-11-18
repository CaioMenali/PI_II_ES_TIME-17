// Autor: Felipe Cesar Ferreira Lirani

// Este arquivo contém as funções JavaScript para a página de login.
// Ele lida com a autenticação do usuário, enviando as credenciais para o backend e gerenciando o estado de login no localStorage.

// Função assíncrona para tentar realizar o login do docente.
// Captura os valores de e-mail e senha, valida-os e os envia para o endpoint /login do backend.
// Em caso de sucesso, armazena o e-mail e o nome do docente no localStorage e redireciona para a página inicial.
async function try_login() {
    // Captura os valores dos campos de e-mail e senha
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Valida se ambos os campos foram preenchidos
    if (!email || !password) {
        alert('Por favor, preencha e-mail e senha!');
        return;
    }

    try {
        // Envia as credenciais para o backend
        const response = await fetch('http://localhost:3000/docentes/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: email, password })
        });

        // Converte a resposta em JSON
        const data = await response.json();

        // Exibe mensagem de retorno do servidor
        alert(data.message || 'Falha no login.');

        // Se login foi bem-sucedido
        if (response.ok && data.success) {
            try {
                // Armazena o e-mail no localStorage
                localStorage.setItem('docenteEmail', email);

                // Busca a lista de docentes para encontrar o nome correspondente
                const res = await fetch('http://localhost:3000/docentes/listar');
                const rows = await res.json();
                let nome = '';

                // Procura o nome do docente com base no e-mail
                if (Array.isArray(rows)) {
                    for (let i = 0; i < rows.length; i++) {
                        const row = rows[i];
                        if (Array.isArray(row) && row[2] === email) {
                            nome = row[1];
                            break;
                        }
                    }
                }

                // Se encontrou o nome, armazena no localStorage
                if (nome) {
                    localStorage.setItem('docenteName', nome);
                }
            } catch (_) {}

            // Redireciona para a página inicial
            window.location.href = 'index.html';
        }
    } catch (err) {
        // Exibe erro caso a conexão com o servidor falhe
        alert('Erro ao conectar com o servidor!');
    }
}

window.onload = function() {
    localStorage.removeItem('docenteName');
    localStorage.removeItem('docenteEmail');
}