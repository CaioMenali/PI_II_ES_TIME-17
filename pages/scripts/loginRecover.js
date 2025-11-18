// Autor: Felipe Cesar Ferreira Lirani

// Este arquivo contém as funções JavaScript para a recuperação de senha.
// Ele lida com a verificação de e-mail e a redefinição de senha do docente, interagindo com os endpoints de recuperação do backend.

// Função assíncrona para verificar se um e-mail existe no banco de dados para recuperação de senha.
// Envia o e-mail para o endpoint /recover/verify-email do backend.
// Se o e-mail for encontrado, exibe a caixa de redefinição de senha; caso contrário, alerta que o e-mail não foi encontrado.
async function verify_email() {
    // Captura o e-mail digitado no campo de entrada
    const email = document.getElementById('email').value;
    try {
        // Envia requisição POST para verificar se o e-mail existe no backend
        const response = await fetch('http://localhost:3000/recover/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        // Converte a resposta do servidor para JSON
        const data = await response.json();
        // Se o e-mail existir, exibe a caixa de redefinição de senha
        if (response.ok && data.exists) {
            document.getElementById('resetBox').style.display = 'block';
        } else {
            // Caso contrário, alerta que o e-mail não foi encontrado
            alert('E-mail não encontrado.');
        }
    } catch (e) {
        // Em caso de erro na conexão, exibe mensagem de erro
        alert('Erro de conexão com o servidor.');
    }
}

// Função assíncrona para redefinir a senha do docente.
// Captura o e-mail e a nova senha, e os envia para o endpoint /recover/reset do backend.
// Em caso de sucesso, alerta que a senha foi atualizada e redireciona para a página de login.
// Função assíncrona para redefinir a senha do docente
async function reset_password() {
    // Captura o e-mail e a nova senha dos campos do formulário
    const email = document.getElementById('email').value;
    const newPassword = document.getElementById('newPassword').value;
    try {
        // Envia requisição POST para o backend com e-mail e nova senha
        const response = await fetch('http://localhost:3000/recover/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword })
        });
        // Converte a resposta do servidor para JSON
        const data = await response.json();
        // Se a resposta for bem-sucedida, exibe alerta e redireciona para login
        if (response.ok && data.success) {
            alert('Senha atualizada com sucesso.');
            window.location.href = 'login.html';
        } else {
            // Caso contrário, exibe mensagem de erro retornada pelo servidor
            alert(data.message || 'Não foi possível atualizar a senha.');
        }
    } catch (e) {
        // Em caso de erro na conexão, exibe mensagem de erro
        alert('Erro de conexão com o servidor.');
    }
}