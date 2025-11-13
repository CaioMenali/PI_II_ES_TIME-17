// Autores: Felipe Batista Bastos,  Felipe Cesar Ferreira Lirani

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
    const resposta = await fetch("http://localhost:3000/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    // Recebe a resposta do servidor (texto)
    const resultado = await resposta.text();

    // Mostra o resultado na tela
    alert(resultado);

    // Se o cadastro for bem-sucedido, vai para a página de login
    if (resultado.includes("sucesso")) {
      window.location.href = "login.html";
    }

  } catch (erro) {
    console.error("Erro ao conectar com o servidor:", erro);
    alert("Erro ao conectar com o servidor!");
  }
}