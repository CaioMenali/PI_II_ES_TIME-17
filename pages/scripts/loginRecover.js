// Autor: Felipe Cesar Ferreira Lirani

// Este arquivo contém as funções JavaScript para a recuperação de senha.
// Ele lida com a verificação de e-mail e a redefinição de senha do docente, interagindo com os endpoints de recuperação do backend.

// Função assíncrona para verificar se um e-mail existe no banco de dados para recuperação de senha.
// Envia o e-mail para o endpoint /recover/verify-email do backend.
// Se o e-mail for encontrado, exibe a caixa de redefinição de senha; caso contrário, alerta que o e-mail não foi encontrado.
async function verify_email() {
    const email = document.getElementById('email').value;
    try {
        const response = await fetch('http://localhost:3000/recover/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (response.ok && data.exists) {
            document.getElementById('resetBox').style.display = 'block';
        } else {
            alert('E-mail não encontrado.');
        }
    } catch (e) {
        alert('Erro de conexão com o servidor.');
    }
}

// Função assíncrona para redefinir a senha do docente.
// Captura o e-mail e a nova senha, e os envia para o endpoint /recover/reset do backend.
// Em caso de sucesso, alerta que a senha foi atualizada e redireciona para a página de login.
async function reset_password() {
    const email = document.getElementById('email').value;
    const newPassword = document.getElementById('newPassword').value;
    try {
        const response = await fetch('http://localhost:3000/recover/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword })
        });
        const data = await response.json();
        if (response.ok && data.success) {
            alert('Senha atualizada com sucesso.');
            window.location.href = 'login.html';
        } else {
            alert(data.message || 'Não foi possível atualizar a senha.');
        }
    } catch (e) {
        alert('Erro de conexão com o servidor.');
    }
}