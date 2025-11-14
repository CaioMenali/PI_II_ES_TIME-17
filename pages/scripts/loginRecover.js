// Autores: Felipe Cesar Ferreira Lirani

async function verify_email() {
    const email = document.getElementById('email').value;
    try {
        const r = await fetch('http://localhost:3000/recover/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await r.json();
        if (r.ok && data.exists) {
            document.getElementById('resetBox').style.display = 'block';
        } else {
            alert('E-mail não encontrado.');
        }
    } catch (e) {
        alert('Erro de conexão com o servidor.');
    }
}

async function reset_password() {
    const email = document.getElementById('email').value;
    const newPassword = document.getElementById('newPassword').value;
    try {
        const r = await fetch('http://localhost:3000/recover/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword })
        });
        const data = await r.json();
        if (r.ok && data.success) {
            alert('Senha atualizada com sucesso.');
            window.location.href = 'login.html';
        } else {
            alert(data.message || 'Não foi possível atualizar a senha.');
        }
    } catch (e) {
        alert('Erro de conexão com o servidor.');
    }
}