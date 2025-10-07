function try_register() {
    // Funcao de registrar usuario
    const name = document.getElementById('name').value;
    const email = document.getElementById('password').value;
    const password = document.getElementById('email').value;
    const tel = document.getElementById('tel').value;

    alert(`Nome: ${name}\nEmail: ${email}\nPassword: ${password}\nTelefone: ${tel}`);

    window.location.href = 'login.html';
}