// Autor: Felipe Cesar Ferreira Lirani

// Este arquivo contém as funções JavaScript para a página de login.
// Ele lida com a autenticação do usuário, enviando as credenciais para o backend e gerenciando o estado de login no localStorage.

// Função assíncrona para tentar realizar o login do docente.
// Captura os valores de e-mail e senha, valida-os e os envia para o endpoint /login do backend.
// Em caso de sucesso, armazena o e-mail e o nome do docente no localStorage e redireciona para a página inicial.
async function try_login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Por favor, preencha e-mail e senha!');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: email, password })
        });

        const data = await response.json();

        alert(data.message || 'Falha no login.');

        if (response.ok && data.success) {
            try {
                localStorage.setItem('docenteEmail', email);
                const res = await fetch('http://localhost:3000/docentes/listar');
                const rows = await res.json();
                let nome = '';
                if (Array.isArray(rows)) {
                    for (let i = 0; i < rows.length; i++) {
                        const row = rows[i];
                        if (Array.isArray(row) && row[2] === email) {
                            nome = row[1];
                            break;
                        }
                    }
                }
                if (nome) {
                    localStorage.setItem('docenteName', nome);
                }
            } catch (_) {}
            window.location.href = 'index.html';
        }
    } catch (err) {
        alert('Erro ao conectar com o servidor!');
    }
}

window.onload = function() {
    localStorage.removeItem('docenteName');
    localStorage.removeItem('docenteEmail');
}