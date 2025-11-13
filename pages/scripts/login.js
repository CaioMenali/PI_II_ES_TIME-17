// Autores: Felipe Cesar Ferreira Lirani

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
            window.location.href = 'index.html';
        }
    } catch (err) {
        alert('Erro ao conectar com o servidor!');
    }
}