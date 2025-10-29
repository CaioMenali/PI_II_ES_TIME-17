// Autores: Felipe Cesar Ferreira Lirani

function try_login() {
    // Funcao de login
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    alert(`Email: ${email}\nPassword: ${password}`);

    window.location.href = '/pages/homepage.html';
}