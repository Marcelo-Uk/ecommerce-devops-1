const API_BASE = "http://localhost:8000/api"; // Base URL para os endpoints

// Função para realizar o login
async function handleLogin(event) {
    event.preventDefault();

    console.log("Iniciando o processo de login...");

    const username = document.querySelector("#username")?.value.trim();
    const password = document.querySelector("#password")?.value.trim();
    const loginMessage = document.querySelector("#loginMessage");

    console.log("Username:", username);
    console.log("Password:", password ? "*******" : "Nenhum valor fornecido"); // Não exibir a senha real no console

    // Limpa mensagens anteriores
    if (loginMessage) {
        loginMessage.textContent = "";
        loginMessage.style.display = "none";
    } else {
        console.warn("Elemento de mensagem de login (#loginMessage) não encontrado no DOM.");
    }

    try {
        console.log("Enviando requisição para:", `${API_BASE}/auth/login/`);
        const response = await fetch(`${API_BASE}/auth/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        console.log("Resposta recebida do servidor:", response);
        const data = await response.json();

        console.log("Dados retornados pelo servidor:", data);

        if (response.ok) {
            console.log("Login bem-sucedido. Salvando tokens no localStorage...");
            // Salva os tokens no localStorage
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);

            console.log("Tokens salvos. Redirecionando para products.html...");
            // Redireciona para a página de produtos
            window.location.href = "products.html";
        } else {
            console.error("Erro de login:", data.detail || "Credenciais inválidas.");

            if (loginMessage) {
                // Exibe mensagem de erro retornada pelo servidor
                loginMessage.textContent = data.detail || "Credenciais inválidas. Tente novamente.";
                loginMessage.style.display = "block";
            }
        }
    } catch (error) {
        console.error("Erro ao realizar login:", error);

        if (loginMessage) {
            loginMessage.textContent = "Erro ao conectar ao servidor. Tente novamente.";
            loginMessage.style.display = "block";
        }
    }
}

// Função para configurar o listener (encapsulada para uso em testes)
function setupLoginForm() {
    console.log("Configurando listener para o formulário de login...");
    const loginForm = document.querySelector("#loginForm");

    if (loginForm) {
        console.log("Formulário de login encontrado. Registrando o evento de submit...");
        loginForm.addEventListener("submit", handleLogin);
    } else {
        console.error("Formulário de login (#loginForm) não encontrado no DOM.");
    }
}

// Chamada inicial para configurar o formulário
setupLoginForm();
