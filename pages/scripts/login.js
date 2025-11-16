// Autor: Felipe Cesar Ferreira Lirani

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
                const res = await fetch('http://localhost:3000/docentes');
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